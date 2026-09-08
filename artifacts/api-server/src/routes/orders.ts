import { Router, type IRouter } from "express";
import { and, desc, eq, ne } from "drizzle-orm";
import {
  CreateDineInOrderBody,
  GetOrderContextQueryParams,
  UpdateStaffOrderStatusBody,
} from "@workspace/api-zod";
import { db } from "@workspace/db";
import {
  cafeTables,
  orderCustomizations,
  orderItems,
  orders,
  tableSessions,
} from "@workspace/db/schema";

const router: IRouter = Router();
const ORDER_STATUSES = ["Order Placed", "Preparing", "Ready", "Served"] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];

function orderId() {
  return `CD-${Date.now().toString(36).toUpperCase()}`;
}

async function getOrCreateTableSession(tableNumber: number) {
  const tableRows = await db
    .select()
    .from(cafeTables)
    .where(eq(cafeTables.tableNumber, tableNumber))
    .limit(1);

  const table = tableRows[0] ?? (
    await db
      .insert(cafeTables)
      .values({ tableNumber, qrToken: `table-${tableNumber}`, status: "active" })
      .returning()
  )[0];

  const sessionRows = await db
    .select()
    .from(tableSessions)
    .where(and(eq(tableSessions.tableId, table.id), eq(tableSessions.status, "active")))
    .limit(1);

  const session = sessionRows[0] ?? (
    await db
      .insert(tableSessions)
      .values({ tableId: table.id, status: "active" })
      .returning()
  )[0];

  return { table, session };
}

async function serializeOrder(orderIdValue: string) {
  const rows = await db
    .select({ order: orders, tableNumber: cafeTables.tableNumber })
    .from(orders)
    .innerJoin(tableSessions, eq(tableSessions.id, orders.sessionId))
    .innerJoin(cafeTables, eq(cafeTables.id, tableSessions.tableId))
    .where(eq(orders.id, orderIdValue))
    .limit(1);

  const row = rows[0];
  if (!row) return undefined;

  const itemRows = await db
    .select({ item: orderItems, customization: orderCustomizations })
    .from(orderItems)
    .leftJoin(orderCustomizations, eq(orderCustomizations.orderItemId, orderItems.id))
    .where(eq(orderItems.orderId, orderIdValue));

  return {
    id: row.order.id,
    sessionId: row.order.sessionId,
    tableNumber: row.tableNumber,
    customerName: row.order.customerName,
    phone: row.order.phone,
    status: row.order.status,
    totalAmount: Number(row.order.totalAmount),
    paymentMethod: row.order.paymentMethod,
    createdAt: row.order.createdAt.toISOString(),
    items: itemRows.map(({ item, customization }) => ({
      id: item.id,
      coffeeId: item.coffeeId,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      subtotal: Number(item.subtotal),
      customization: {
        size: customization?.size ?? "Medium",
        milk: customization?.milk ?? "None",
        sweetness: customization?.sweetness ?? "None",
        extra: customization?.extras ?? "None",
        additionalPrice: Number(customization?.additionalPrice ?? 0),
      },
    })),
  };
}

router.get("/order-context", async (req, res) => {
  const parsed = GetOrderContextQueryParams.safeParse({ table: req.query.table });
  if (!parsed.success) {
    res.status(400).json({ message: "A valid table number is required." });
    return;
  }

  try {
    const { table, session } = await getOrCreateTableSession(parsed.data.table);
    res.json({
      table: { id: table.id, tableNumber: table.tableNumber, status: table.status },
      session: { id: session.id, status: session.status, startedAt: session.startedAt.toISOString() },
    });
  } catch (error) {
    req.log.error({ error }, "Failed to identify table");
    res.status(500).json({ message: "We could not open this table session." });
  }
});

router.post("/orders", async (req, res) => {
  const parsed = CreateDineInOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Please check the order details.", issues: parsed.error.issues });
    return;
  }

  const input = parsed.data;
  const totalAmount = input.items.reduce((total, item) => total + item.subtotal, 0);
  const id = orderId();

  try {
    await db.transaction(async tx => {
      await tx.insert(orders).values({
        id,
        sessionId: input.sessionId,
        customerName: input.customerName.trim(),
        phone: input.phone.trim(),
        status: "Order Placed",
        totalAmount: totalAmount.toFixed(2),
        paymentMethod: input.paymentMethod,
      });

      for (const inputItem of input.items) {
        const insertedItems = await tx.insert(orderItems).values({
          orderId: id,
          coffeeId: inputItem.coffeeId,
          quantity: inputItem.quantity,
          unitPrice: inputItem.unitPrice.toFixed(2),
          subtotal: inputItem.subtotal.toFixed(2),
        }).returning({ id: orderItems.id });

        const insertedItem = insertedItems[0];
        if (!insertedItem) throw new Error("Order item could not be created.");

        await tx.insert(orderCustomizations).values({
          orderItemId: insertedItem.id,
          size: inputItem.customization.size,
          milk: inputItem.customization.milk,
          sweetness: inputItem.customization.sweetness,
          extras: inputItem.customization.extra,
          additionalPrice: inputItem.customization.additionalPrice.toFixed(2),
        });
      }
    });

    const response = await serializeOrder(id);
    if (!response) {
      res.status(500).json({ message: "Order was created but could not be loaded." });
      return;
    }
    res.status(201).json(response);
  } catch (error) {
    req.log.error({ error }, "Failed to create order");
    res.status(500).json({ message: "We could not place your order." });
  }
});

router.get("/orders/:id", async (req, res) => {
  try {
    const response = await serializeOrder(req.params.id);
    if (!response) {
      res.status(404).json({ message: "Order not found." });
      return;
    }
    res.json(response);
  } catch (error) {
    req.log.error({ error }, "Failed to load order");
    res.status(500).json({ message: "We could not load this order." });
  }
});

router.get("/staff/orders", async (req, res) => {
  try {
    const rows = await db
      .select({
        id: orders.id,
        tableNumber: cafeTables.tableNumber,
        customerName: orders.customerName,
        status: orders.status,
        totalAmount: orders.totalAmount,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .innerJoin(tableSessions, eq(tableSessions.id, orders.sessionId))
      .innerJoin(cafeTables, eq(cafeTables.id, tableSessions.tableId))
      .where(ne(orders.status, "Served"))
      .orderBy(desc(orders.createdAt));

    res.json({
      orders: rows.map(row => ({
        ...row,
        totalAmount: Number(row.totalAmount),
        createdAt: row.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    req.log.error({ error }, "Failed to load staff orders");
    res.status(500).json({ message: "We could not load active orders." });
  }
});

router.patch("/staff/orders/:id/status", async (req, res) => {
  const parsed = UpdateStaffOrderStatusBody.safeParse(req.body);
  if (!parsed.success || !ORDER_STATUSES.includes(parsed.data.status as OrderStatus)) {
    res.status(400).json({ message: "Invalid order status." });
    return;
  }

  try {
    await db.update(orders).set({ status: parsed.data.status }).where(eq(orders.id, req.params.id));
    const response = await serializeOrder(req.params.id);
    if (!response) {
      res.status(404).json({ message: "Order not found." });
      return;
    }
    res.json(response);
  } catch (error) {
    req.log.error({ error }, "Failed to update order status");
    res.status(500).json({ message: "We could not update this order." });
  }
});

router.post("/staff/tables/:tableNumber/session/close", async (req, res) => {
  const tableNumber = Number(req.params.tableNumber);
  if (!Number.isInteger(tableNumber) || tableNumber < 1) {
    res.status(400).json({ message: "Invalid table number." });
    return;
  }

  try {
    const tableRows = await db
      .select({ id: cafeTables.id })
      .from(cafeTables)
      .where(eq(cafeTables.tableNumber, tableNumber))
      .limit(1);
    const table = tableRows[0];
    if (!table) {
      res.status(404).json({ message: "Table not found." });
      return;
    }
    const activeSessions = await db
      .select({ id: tableSessions.id })
      .from(tableSessions)
      .where(and(eq(tableSessions.tableId, table.id), eq(tableSessions.status, "active")));
    for (const session of activeSessions) {
      await db.update(orders).set({ status: "Served" }).where(eq(orders.sessionId, session.id));
      await db
        .update(tableSessions)
        .set({ status: "closed", closedAt: new Date() })
        .where(eq(tableSessions.id, session.id));
    }
    res.json({ tableNumber, status: "closed" });
  } catch (error) {
    req.log.error({ error }, "Failed to close table session");
    res.status(500).json({ message: "We could not close this table session." });
  }
});

export default router;