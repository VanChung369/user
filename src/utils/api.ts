import { HEADERS, HEADERS_MULTIPLE_PART } from "@/constants/api";

const setTokenCallApi = (token?: string) => {
  HEADERS["Authorization"] = `Bearer ${token}`;
  HEADERS_MULTIPLE_PART["Authorization"] = `Bearer ${token}`;
};

export { setTokenCallApi };
