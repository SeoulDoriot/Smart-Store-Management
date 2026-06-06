export type OrderStatus =
  | "New Order"
  | "Waiting Payment"
  | "Paid"
  | "Preparing"
  | "Packing"
  | "Delivering"
  | "Completed"
  | "Cancelled";

export type PaymentStatus =
  | "Payment Pending"
  | "Payment Submitted"
  | "Payment Successful"
  | "Payment Rejected"
  | "Payment Failed"
  | "Payment Expired"
  | "Refunded";

export type DeliveryStatus =
  | "Order Created"
  | "Payment Successful"
  | "Preparing"
  | "Packing"
  | "Ready for Delivery"
  | "Delivering"
  | "Completed"
  | "Cancelled";

export type DeliveryOption =
  | "Pickup at shop"
  | "Delivery in Phnom Penh"
  | "Delivery to province";

export type PaymentMethod =
  | "Manual"
  | "KHQR"
  | "ABA"
  | "Bakong"
  | "Cash on Delivery";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: string;
  order_code: string;
  customer_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_telegram?: string;
  delivery_address?: string;
  delivery_option: DeliveryOption;
  note?: string;
  total_amount: number;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  delivery_status: DeliveryStatus;
  items?: OrderItem[];
  created_at?: string;
}

export interface Payment {
  id: string;
  order_id: string;
  payment_method: PaymentMethod;
  amount: number;
  payment_status: PaymentStatus;
  transaction_id?: string;
  payment_reference?: string;
  paid_at?: string;
}

export interface Delivery {
  id: string;
  order_id: string;
  delivery_company?: string;
  tracking_code?: string;
  rider_name?: string;
  rider_phone?: string;
  delivery_note?: string;
  estimated_delivery_date?: string;
  delivery_status: DeliveryStatus;
}
