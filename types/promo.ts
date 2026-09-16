export interface Promo {
  code: string;
  discountPercent: number;
  fixedDiscount: number;
  label: string;
  labelAr: string;
  minOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface PromoValidationResponse {
  isValid: boolean;
  code: string;
  message: string;
  discountPercent: number;
  fixedDiscount: number;
  discountAmount: number;
  newTotal: number;
  label: string;
  labelAr: string;
}
