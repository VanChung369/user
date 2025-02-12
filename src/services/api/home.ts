import { api } from "..";

export async function getOverview() {
  return api.get({ endpoint: "/api/overview" });
}
