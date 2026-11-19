export type UserRole = 'buyer' | 'artisan';

export interface UserDTO {
  _id: string;
  githubId: string;
  name: string;
  role: UserRole;
  avatarUrl: string;
}

export interface ProductDTO {
  _id: string;
  artisanId: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface OrderDTO {
  _id: string;
  buyerId: string;
  productId: string;
  status: string;
  createdAt: string;
}
