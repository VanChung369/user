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
