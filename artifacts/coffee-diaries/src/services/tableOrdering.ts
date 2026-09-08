import {
  createDineInOrder,
  getDineInOrder,
  getOrderContext,
  listStaffOrders,
  updateStaffOrderStatus,
  type CreateOrderRequest,
  type OrderResponse,
  type StaffOrder,
  type UpdateOrderStatusRequestStatus,
} from '@workspace/api-client-react';
import { getBasePrice, saveOrder, type CartItem, type Order, type OrderStatus, type TableContext } from './orderStorage';

export type { StaffOrder, UpdateOrderStatusRequestStatus };

export async function identifyTable(tableNumber: number) {
  return getOrderContext({ table: tableNumber });
}

export function orderResponseToLocal(response: OrderResponse): Order {
  const items: CartItem[] = response.items.map(item => ({
    id: item.id,
    coffeeId: item.coffeeId,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    customization: {
      size: item.customization.size as CartItem['customization']['size'],
      milk: item.customization.milk as CartItem['customization']['milk'],
      sweetness: item.customization.sweetness as CartItem['customization']['sweetness'],
      extra: item.customization.extra as CartItem['customization']['extra'],
    },
    addedAt: response.createdAt,
  }));

  return {
    id: response.id,
    sessionId: response.sessionId,
    tableNumber: response.tableNumber,
    items,
    total: response.totalAmount,
    status: response.status as OrderStatus,
    customerName: response.customerName,
    phone: response.phone,
    paymentMethod: response.paymentMethod,
    createdAt: response.createdAt,
  };
}

export async function placeTableOrder(input: CreateOrderRequest) {
  const response = await createDineInOrder(input);
  saveOrder(orderResponseToLocal(response));
  return response;
}

export async function loadRemoteOrder(id: string) {
  const response = await getDineInOrder(id);
  saveOrder(orderResponseToLocal(response));
  return response;
}

export async function moveRemoteOrder(id: string, status: UpdateOrderStatusRequestStatus) {
  const response = await updateStaffOrderStatus(id, { status });
  saveOrder(orderResponseToLocal(response));
  return response;
}

export async function loadStaffOrders(): Promise<StaffOrder[]> {
  const response = await listStaffOrders();
  return response.orders;
}

export function tableOrderInput(
  context: TableContext,
  items: CartItem[],
  paymentMethod: string,
): CreateOrderRequest {
  return {
    sessionId: context.sessionId,
    tableNumber: context.tableNumber,
    customerName: context.customerName,
    phone: context.phone,
    paymentMethod,
    items: items.map(item => ({
      coffeeId: item.coffeeId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.unitPrice * item.quantity,
      customization: {
        size: item.customization.size,
        milk: item.customization.milk,
        sweetness: item.customization.sweetness,
        extra: item.customization.extra,
        additionalPrice: Math.max(0, item.unitPrice - getBasePrice(item.coffeeId)),
      },
    })),
  };
}