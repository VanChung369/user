import { api } from "..";

export async function getNfts(params?: any, options?: { [key: string]: any }) {
  return api.get({
    endpoint: "/api/nfts",
    params: params,
    options: options,
  });
}
