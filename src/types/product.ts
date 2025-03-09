export interface IProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  stock: number;
  category: string;
}

export interface CreateProductInput {
  name: string;
  price: number;
  image: string;
  description: string;
  stock: number;
  category: string;
}

export interface UpdateProductInput {
  id: string;
  name?: string;
  price?: number;
  image?: string;
  description?: string;
  stock?: number;
  category?: string;
}