import { create } from 'zustand';
import type { IProduct } from '@/types';
import Cookies from 'js-cookie';

interface ProductState {
  product: IProduct | null;
  setProduct: (product: IProduct) => void;
  clearProduct: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
  product: Cookies.get('product') ? JSON.parse(Cookies.get('product') as string) as IProduct : null,

  setProduct: (product: IProduct) => {
    Cookies.set('product', JSON.stringify(product));
    set({ product });
  },

  clearProduct: () => {
    Cookies.remove('product');
    set({ product: null });
  },
}));