import axiosInstance from './api';

export const getProducts = async () => {
  const response = await axiosInstance.get('/products');
  return response.data;
}

export const getProduct = async (productId: string) => {
  const response = await axiosInstance.get(`/products/${productId}`);
  return response.data;
}

export const createProduct = async (productData: any) => {
  const response = await axiosInstance.post('/products', productData);
  return response.data;
}

export const updateProduct = async (productId: string, productData: any) => {
  const response = await axiosInstance.put(`/products/${productId}`, productData);
  return response.data;
}

export const deleteProduct = async (productId: string) => {
  const response = await axiosInstance.delete(`/products/${productId}`);
  return response.data;
}