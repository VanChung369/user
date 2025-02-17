import { api } from "..";

export async function listForSaleNFT(
  id: string,
  data: any,
  options?: { [key: string]: any }
) {
  return api.post({
    endpoint: `/api/sale-orders/${id}`,
    params: data,
    options: options,
  });
}
