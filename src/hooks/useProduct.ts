import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProduct, getProducts,createProduct, deleteProduct, updateProduct } from '../apis';
import { useProductStore } from '../stores';
import type { IProduct, CreateProductInput, UpdateProductInput } from '@/types';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const useGetProduct = (productId: string) => {
  const { setProduct } = useProductStore();

  const { data, isLoading, isError, error, isSuccess } = useQuery<IProduct, Error, IProduct, [string, string]>({
    queryKey: ['product', productId],
    queryFn: () => getProduct(productId),
    enabled: !!productId,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (isError && error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast.error(errorMessage);
    }
    if (isSuccess && data) {
      setProduct(data);
    }
  }, [isError, error, isSuccess, data]);

  return { product: data, isLoading, isError, error };
};

const useGetProducts = () => {
  const { setProduct } = useProductStore();

  const { data, isLoading, isError, error, isSuccess } = useQuery<IProduct[], Error, IProduct>({
    queryKey: ['products'],
    queryFn: getProducts,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (isError && error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast.error(errorMessage);
    }
    if (isSuccess && data) {
      setProduct(data);
    }
  }, [isError, error, isSuccess, data]);

  return { products: data, isLoading, isError, error };
};

const useCreateProduct = () => {
  const { setProduct } = useProductStore();
  const queryClient = useQueryClient();

  const createProductMutation = useMutation<IProduct, Error, CreateProductInput>({
    mutationFn: (newProduct: CreateProductInput) => createProduct(newProduct),
    onSuccess: (data: IProduct) => {
      if (data && 'id' in data) {
        setProduct(data);
      }
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', data.id] });
      toast.success('Create product successfully');
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
    },
    onSettled: (_data, _error) => {
      console.log('Mutation is settled', _data, _error);
    },
  });

  return {
    mutate: createProductMutation.mutate,
    isPending: createProductMutation.isPending,
    isError: createProductMutation.isError,
    isSuccess: createProductMutation.isSuccess,
    error: createProductMutation.error,
  };
};

const useUpdateProduct = () => {
  const { setProduct } = useProductStore();
  const queryClient = useQueryClient();

  const updateProductMutation = useMutation<IProduct, Error, UpdateProductInput>({
    mutationFn: (product: UpdateProductInput) => updateProduct(product.id, product),
    onSuccess: (data: IProduct) => {
      if (data && 'id' in data) {
        setProduct(data);
      }
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', data.id] });
      toast.success('Update product successfully');
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
    },
    onSettled: (_data, _error) => {
      console.log('Mutation is settled', _data, _error);
    },
  });

  return {
    mutate: updateProductMutation.mutate,
    isPending: updateProductMutation.isPending,
    isError: updateProductMutation.isError,
    isSuccess: updateProductMutation.isSuccess,
    error: updateProductMutation.error,
  };
};

const useDeleteProduct = () => {
  const { clearProduct } = useProductStore();
  const queryClient = useQueryClient();

  const deleteProductMutation = useMutation<IProduct, Error, string>({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: () => {
      clearProduct();
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Delete product successfully');
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
    },
    onSettled: (_data, _error) => {
      console.log('Mutation is settled', _data, _error);
    },
  });

  return {
    mutate: deleteProductMutation.mutate,
    isPending: deleteProductMutation.isPending,
    isError: deleteProductMutation.isError,
    isSuccess: deleteProductMutation.isSuccess,
    error: deleteProductMutation.error,
  };
};

export { useGetProduct, useGetProducts, useCreateProduct, useUpdateProduct, useDeleteProduct };