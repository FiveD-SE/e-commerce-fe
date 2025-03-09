import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUser, createUser } from '../apis';
import { useUserStore } from '../stores';
import type { IUser, CreateUserInput } from '@/types';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const useGetUser = (userId: string) => {
  const { setUser } = useUserStore();

  const { data, isLoading, isError, error, isSuccess } = useQuery<IUser, Error, IUser, [string, string]>({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (isError && error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast.error(errorMessage);
    }
    if (isSuccess && data) {
      setUser(data);
    }
  }, [isError, error, isSuccess, data]);

  return { user: data, isLoading, isError, error };
};

const useCreateUser = () => {
  const { setUser } = useUserStore();
  const queryClient = useQueryClient();

  const createUserMutation = useMutation<IUser, Error, CreateUserInput>({
    mutationFn: (newUser: CreateUserInput) => createUser(newUser),
    onSuccess: (data: IUser) => {
      if (data && 'id' in data) {
        setUser(data);
      }
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', data.id] });
      toast.success('Create user successfully');
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
    },
    onSettled: (_data, _error) => {
      console.log('Mutation is settled', _data, _error);
    },
  });

  return {
    mutate: createUserMutation.mutate,
    isPending: createUserMutation.isPending,
    isError: createUserMutation.isError,
    isSuccess: createUserMutation.isSuccess,
    error: createUserMutation.error,
  };
};

export { useGetUser, useCreateUser };