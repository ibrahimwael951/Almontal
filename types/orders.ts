export interface OrderItem {
  id: number;
  productId: string;
  productName: string;
  productNameAr: string;
  unitPrice: number;
  quantity: number;
  unitType: string;
  customNote: string;
  totalPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  deliveryMethod: string;
  shippingAddress: string;
  shippingCity: string;
  pickupLocationId: string;
  paymentMethod: string;
  transactionRef: string;
  instapayReceiptBase64: string;
  subtotal: number;
  discountAmount: number;
  appliedPromoCode: string;
  deliveryFee: number;
  total: number;
  status: string;
  notes: string;
  createdAt: string;
  items: OrderItem[];
}
