import { listForSaleNFT } from "@/services/api/saleOrder";
import {
  createTransactions,
  updateTransactionHash,
  updateTransactions,
} from "@/services/api/transaction";
import { useMutation } from "@tanstack/react-query";

export interface paramListForSaleNFT {
  id: string;
  data?: any;
  onSuccess: (id?: any) => void;
  onError: () => void;
}

export const useListForSaleNFT = () => {
  const handleListForSaleNFT = useMutation({
    mutationFn: async (params: paramListForSaleNFT) => {
      try {
        const response = await listForSaleNFT(params.id, params.data);
        return response;
      } catch (error) {
        throw error;
      }
    },
    onError: (error, variables, context) => {
      variables.onError();
    },
    onSuccess: (data, variables, context) => {
      variables.onSuccess(data._id);
    },
    onSettled: (data, error, variables, context) => {},
  });

  return {
    loading: handleListForSaleNFT.isPending,
    onListForSaleNFT: handleListForSaleNFT.mutate,
  };
};
