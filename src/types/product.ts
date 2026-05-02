export interface Product {
  categoria: string;
  itemId: number;
  productName: string;
  offerLink: string;
  priceMin: string;
  priceMax: string;
  imageUrl: string;
  sales: number;
  ratingStar: string;
  priceDiscountRate: number;
  createdAt: string;
  statsLabel?: string;
  couponLabel?: string;
}
