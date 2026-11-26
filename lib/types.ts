export type ProductView = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string | null;
  artisanName: string;
};

export type OrderView = {
  id: string;
  status: string;
  createdAt: string;
  product: ProductView | null;
};
