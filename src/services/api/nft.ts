import { api } from "..";

export async function getNfts(params?: any, options?: { [key: string]: any }) {
  return api.get({
    endpoint: "/api/nfts",
    params: params,
    options: options,
  });
}

export async function getNftDetail(id: string) {
  return api.get({
    endpoint: `/api/nfts/${id}`,
  });
}

export async function getOwned(id: string, params?: any) {
  return api.get({
    endpoint: `/api/nfts/${id}/owned`,
    params: params,
  });
}

export async function getListing(id: string, params?: any) {
  return api.get({
    endpoint: `/api/nfts/${id}/sale-orders`,
    params: params,
  });
}

export async function getActivities(id: string, params?: any) {
  return api.get({
    endpoint: `/api/nfts/${id}/transactions`,
    params: params,
  });
}
