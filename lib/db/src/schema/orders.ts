import { createInsertSchema } from "drizzle-zod";
import { integer, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const cafeTables = pgTable("cafe_tables", {
  id: uuid("id").defaultRandom().primaryKey(),
  tableNumber: integer("table_number").notNull().unique(),
  qrToken: text("qr_token").notNull().unique(),
  status: text("status").notNull().default("active"),
});

export const tableSessions = pgTable("table_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  tableId: uuid("table_id").notNull().references(() => cafeTables.id),
  status: text("status").notNull().default("active"),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  closedAt: timestamp("closed_at", { withTimezone: true }),
});

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  sessionId: uuid("session_id").notNull().references(() => tableSessions.id),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  status: text("status").notNull().default("Order Placed"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull().default("Payment at table"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id),
  coffeeId: text("coffee_id").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
});

export const orderCustomizations = pgTable("order_customizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderItemId: uuid("order_item_id").notNull().references(() => orderItems.id),
  size: text("size").notNull(),
  milk: text("milk").notNull(),
  sweetness: text("sweetness").notNull(),
  extras: text("extras").notNull().default("None"),
  additionalPrice: numeric("additional_price", { precision: 10, scale: 2 }).notNull().default("0"),
});

export const insertCafeTableSchema = createInsertSchema(cafeTables).omit({ id: true });
export const insertTableSessionSchema = createInsertSchema(tableSessions).omit({ id: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ createdAt: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });
export const insertOrderCustomizationSchema = createInsertSchema(orderCustomizations).omit({ id: true });

export type CafeTable = typeof cafeTables.$inferSelect;
export type TableSession = typeof tableSessions.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type OrderCustomization = typeof orderCustomizations.$inferSelect;
export type InsertOrderRequest = z.infer<typeof insertOrderSchema>;