import { api } from "..";

export async function getNotices(
  params: any,
  options?: { [key: string]: any }
) {
  return api.get({
    endpoint: "/api/notifications",
    params: params,
    options: options,
  });
}

export async function markAsRead(id: string, body?: any) {
  return api.patch({
    endpoint: `/api/notifications/${id}`,
    params: body,
  });
}
