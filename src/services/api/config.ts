import { api } from "..";

export async function getConfig() {
  return api.get({ endpoint: "/api/config" });
}
