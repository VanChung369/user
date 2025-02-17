import { api } from "..";

export async function login(data: any, options?: { [key: string]: any }) {
  return api.post({
    endpoint: "/api/auth/login",
    params: data,
    options: options,
  });
}

export async function outLogin(
  options?: { [key: string]: any },
  address?: string
): Promise<Record<string, any>> {
  return api.delete({
    endpoint: `/api/auth/${address}`,
    options: options,
  });
}

export async function refreshToken(
  data: any,
  options?: { [key: string]: any }
) {
  return api.post({
    endpoint: "/api/auth/refresh",
    params: data,
    options: options,
  });
}
