import throttle from "lodash/throttle";
import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import { HEADERS, HEADERS_MULTIPLE_PART } from "@/constants/api";
import HTTP_STATUS_CONTSTANTS from "@/constants/status";
import formatMessage from "@/components/FormatMessage";
import { validateStatus } from "@/utils/schema";
import {
  handleRemoveAddressNetwork,
  handleSetAddressNetwork,
} from "@/redux/address/slice";
import { handleSetAuthenticationToken } from "@/redux/authentication/slice";
import { store } from "@/redux/configStore";

type ApiOptions = AxiosRequestConfig & {
  isHideErrorMessage?: boolean;
};

type ApiRequestConfig = {
  endpoint: string;
  params?: any;
  options?: ApiOptions;
  headers?: any;
};

export const excludeResponse = ["empty_response"];

const getFullUrl = (url: string) => {
  if (!url.startsWith("/")) {
    url = "/" + url;
  }
  return `${process.env.NEXT_PUBLIC_APP_API}` + url;
};

const resetToLogin = () => {
  const address = store?.getState()?.AddressSlice?.address;

  store?.dispatch(handleSetAddressNetwork({}));
  store?.dispatch(handleSetAuthenticationToken(""));
  store?.dispatch(handleRemoveAddressNetwork({ address }));
};

const throttledResetToLogin = throttle(resetToLogin, 500, {
  leading: false,
  trailing: true,
}) as any;

const checkErrorNetwork = (err: any) => {
  if (err?.toJSON() && err.toJSON().message === "Network Error") {
    return formatMessage({
      msgContent: "Server error. Please try again!",
      type: "error",
    });
  }
  return err;
};

const checkErrorStatus = (response: any, options?: ApiOptions) => {
  if (
    response?.status >= HTTP_STATUS_CONTSTANTS.ERROR &&
    !excludeResponse.includes(response?.data?.code)
  ) {
    if (HTTP_STATUS_CONTSTANTS.SERVER_ERROR !== response?.data?.code) {
      !options?.isHideErrorMessage &&
        formatMessage({
          msgContent: response?.data?.code
            ? `codeMessage.${response?.data?.code}`
            : `codeMessage.${response?.code}`,
          type: "error",
        });
    } else {
      !options?.isHideErrorMessage &&
        formatMessage({
          msgContent: response?.meta?.msg,
          type: "error",
        });
    }
  }
  return response;
};

export const checkSuccessRequest = (response: any) => {
  return response?.status < HTTP_STATUS_CONTSTANTS.ERROR;
};

const checkExpiredOrAuthorization = (response: any) => {
  return HTTP_STATUS_CONTSTANTS.ERROR_CODE_401 === response?.status;
};

const handleSuccessResponse = (
  response: AxiosResponse,
  options?: ApiOptions,
) => {
  if (checkExpiredOrAuthorization(response)) {
    throttledResetToLogin();
    return response?.data;
  }
  return checkErrorStatus(response, options);
};

const handleErrorResponse = (err: any, options?: ApiOptions) => {
  return checkErrorStatus(err?.response, options) || checkErrorNetwork(err);
};

const requestApi = ({
  method,
  endpoint,
  params,
  options,
  headers,
}: ApiRequestConfig & { method: Method }) => {
  const config: AxiosRequestConfig = {
    headers: headers || HEADERS,
    validateStatus,
    ...(options || {}),
  };

  if (method === "GET" || method === "DELETE") {
    config.params = params ? { ...params } : undefined;
  }

  const data = method === "GET" || method === "DELETE" ? undefined : params;

  return axios
    .request({
      ...config,
      method,
      url: getFullUrl(endpoint),
      data,
    })
    .then(
      (response) => handleSuccessResponse(response, options),
      (err) => handleErrorResponse(err, options),
    )
    .catch((response: any) => response.data);
};

const requestMultipart = (
  method: "POST" | "PATCH",
  endpoint: string,
  params?: any,
  options?: ApiOptions,
) => {
  return requestApi({
    method,
    endpoint,
    params,
    headers: HEADERS_MULTIPLE_PART,
    options,
  });
};

const api = {
  get: (config: ApiRequestConfig) => requestApi({ ...config, method: "GET" }),
  post: (config: ApiRequestConfig) => requestApi({ ...config, method: "POST" }),
  put: (config: ApiRequestConfig) => requestApi({ ...config, method: "PUT" }),
  patch: (config: ApiRequestConfig) =>
    requestApi({ ...config, method: "PATCH" }),
  delete: (config: ApiRequestConfig) =>
    requestApi({ ...config, method: "DELETE" }),
  postMultiplePart: (endpoint: string, params?: any, options?: ApiOptions) =>
    requestMultipart("POST", endpoint, params, options),
  patchMultipart: (endpoint: string, params?: any, options?: ApiOptions) =>
    requestMultipart("PATCH", endpoint, params, options),
};

export { api };
