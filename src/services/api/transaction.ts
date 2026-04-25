import { api } from "..";

export async function createTransactions(body?: any) {
  return api.post({
    endpoint: "/api/transactions",
    params: body,
  });
}

export async function updateTransactions(id: string, body?: any) {
  return api.patch({
    endpoint: `/api/transactions/${id}`,
    params: body,
  });
}

export async function updateTransactionHash(id: string, body?: any) {
  return api.patch({
    endpoint: `/api/transactions/${id}/hash`,
    params: body,
  });
}

export async function getSaleHistory(
  params?: any,
  options?: { [key: string]: any }
) {
  return api.get({
    endpoint: "/api/transactions/sale-histories",
    params: params,
    options: options,
  });
}

export async function getPurchaseHistory(
  params?: any,
  options?: { [key: string]: any }
) {
  return api.get({
    endpoint: "/api/transactions/purchase-histories",
    params: params,
    options: options,
  });
}
