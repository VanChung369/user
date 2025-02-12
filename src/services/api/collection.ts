import { api } from "..";

export async function getCollections(
  params?: any,
  options?: { [key: string]: any }
) {
  return api.get({
    endpoint: "/api/collection",
    params: params,
    options: options,
  });
}
