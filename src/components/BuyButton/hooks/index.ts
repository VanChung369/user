import {
  createTransactions,
  updateTransactionHash,
  updateTransactions,
} from "@/services/api/transaction";
import { useMutation } from "@tanstack/react-query";

// transaction

export interface paramCreateTransaction {
  data: any;
  onSuccess: (id?: any, data?: any) => void;
  onError: () => void;
}

export interface paramUpdateTransaction {
  id: string;
  data: any;
  onSuccess: () => void;
  onError: () => void;
}

export const useCreateTransaction = () => {
  const handleCreateTransaction = useMutation({
    mutationFn: async (params: paramCreateTransaction) => {
      try {
        const response = await createTransactions(params.data);
        return response;
      } catch (error) {
        throw error;
      }
    },
    onError: (error, variables, context) => {
      variables.onError();
    },
    onSuccess: (res, variables, context) => {
      const dataRequest = res?.data?.signature?.dataRequest || [];
      variables.onSuccess(res?.data._id, dataRequest);
    },
    onSettled: (data, error, variables, context) => {},
  });

  return {
    loading: handleCreateTransaction.isPending,
    onCreateTransaction: handleCreateTransaction.mutate,
  };
};

export const useUpdateTransaction = () => {
  const handleUpdateTransaction = useMutation({
    mutationFn: async (params: paramUpdateTransaction) => {
      try {
        const response = await updateTransactions(params.id, params.data);
        return response;
      } catch (error) {
        throw error;
      }
    },
    onError: (error, variables, context) => {
      variables.onError();
    },
    onSuccess: (data, variables, context) => {
      variables.onSuccess();
    },
    onSettled: (data, error, variables, context) => {},
  });

  return {
    loading: handleUpdateTransaction.isPending,
    onUpdateTransaction: handleUpdateTransaction.mutate,
  };
};

export const useUpdateTransactionHash = () => {
  const handleUpdateTransactionHash = useMutation({
    mutationFn: async (params: any) => {
      try {
        const response = await updateTransactionHash(params.id, params.data);
        return response;
      } catch (error) {
        throw error;
      }
    },
    onError: (error, variables, context) => {},
    onSuccess: (data, variables, context) => {},
    onSettled: (data, error, variables, context) => {},
  });

  return {
    loading: handleUpdateTransactionHash.isPending,
    onUpdateTransactionHash: handleUpdateTransactionHash.mutate,
  };
};
