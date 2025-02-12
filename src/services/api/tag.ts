import { api } from "..";

export async function getTags(params?: any, options?: { [key: string]: any }) {
  return api.get({
    endpoint: "/api/tag",
    params: params,
    options: options,
  });
}
