import { api } from "..";

export async function login(body: any, options?: { [key: string]: any }) {
  return api.post({
    endpoint: "/api/auth/login",
    params: body,
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
  body: any,
  options?: { [key: string]: any }
) {
  return api.post({
    endpoint: "/api/auth/refresh",
    params: body,
    options: options,
  });
}
