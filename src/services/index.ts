import { throttle } from "lodash";
import axios from "axios";
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
      descriptor: { id: "codeMessage.E103" },
      type: "error",
    });
  }
  return err;
};

export const excludeResponse = ["empty_response"];

const checkErrorStatus = (
  response: any,
  options?: {
    isHideErrorMessage?: any;
  }
) => {
  if (
    response?.status >= HTTP_STATUS_CONTSTANTS.ERROR &&
    !excludeResponse.includes(response?.data?.code)
  ) {
    if (HTTP_STATUS_CONTSTANTS.SERVER_ERROR !== response?.data?.code) {
      !options?.isHideErrorMessage &&
        formatMessage({
          descriptor: {
            id: response?.data?.code
              ? `codeMessage.${response?.data?.code}`
              : `codeMessage.${response?.code}`,
          },
          type: "error",
        });
    } else {
      !options?.isHideErrorMessage &&
        formatMessage({
          descriptor: { id: response?.meta?.msg },
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

const api = {
  get: ({
    endpoint,
    params,
    options,
    headers,
  }: {
    endpoint: string;
    params?: any;
    options?: { [key: string]: any };
    headers?: any;
  }) => {
    return axios
      .get(getFullUrl(endpoint), {
        headers: headers || HEADERS,
        params: {
          ...params,
        },
        validateStatus: (status: any) => validateStatus(status),
        ...(options || {}),
      })
      .then(
        (response: any) => {
          if (checkExpiredOrAuthorization(response)) {
            throttledResetToLogin(endpoint, params, response);
            return checkErrorStatus(response?.data, options);
          }
          return checkErrorStatus(response, options);
        },
        (err: any) => {
          return (
            checkErrorStatus(err?.response, options) || checkErrorNetwork(err)
          );
        }
      )
      .catch((response: any) => {
        return response.data;
      });
  },

  post: ({
    endpoint,
    params,
    options,
    headers,
  }: {
    endpoint: string;
    params?: any;
    options?: { [key: string]: any };
    headers?: any;
  }) => {
    return axios
      .post(getFullUrl(endpoint), params, {
        headers: headers || HEADERS,
        validateStatus: (status: any) => validateStatus(status),
      })
      .then(
        (response: any) => {
          if (checkExpiredOrAuthorization(response)) {
            throttledResetToLogin(endpoint, params, response);
            return response?.data;
          }
          return checkErrorStatus(response, options);
        },
        (err: any) => {
          return (
            checkErrorStatus(err?.response, options) || checkErrorNetwork(err)
          );
        }
      )
      .catch((response: any) => {
        return response.data;
      });
  },

  put: ({
    endpoint,
    params,
    options,
    headers,
  }: {
    endpoint: string;
    params?: any;
    options?: { [key: string]: any };
    headers?: any;
  }) => {
    return axios
      .put(getFullUrl(endpoint), params, {
        headers: headers || HEADERS,
        validateStatus: (status: any) => validateStatus(status),
        ...(options || {}),
      })
      .then(
        (response: any) => {
          if (checkExpiredOrAuthorization(response)) {
            throttledResetToLogin(endpoint, params, response);
            return checkErrorStatus(response?.data, options);
          }
          return checkErrorStatus(response, options);
        },
        (err: any) => {
          return (
            checkErrorStatus(err?.response, options) || checkErrorNetwork(err)
          );
        }
      )
      .catch((response: any) => {
        return response.data;
      });
  },

  postMultiplePart: (endpoint: string, params?: any, options?: any) => {
    return axios
      .post(getFullUrl(endpoint), params, {
        headers: HEADERS_MULTIPLE_PART,
        validateStatus: (status: any) => validateStatus(status),
      })
      .then(
        (response: any) => {
          if (checkExpiredOrAuthorization(response)) {
            throttledResetToLogin(endpoint, params, response);
            return response?.data;
          }
          return checkErrorStatus(response, options);
        },
        (err: any) => {
          return (
            checkErrorStatus(err?.response, options) || checkErrorNetwork(err)
          );
        }
      )
      .catch((response: any) => {
        return response.data;
      });
  },

  patch: ({
    endpoint,
    params,

    options,
    headers,
  }: {
    endpoint: string;
    params?: any;

    options?: { [key: string]: any };
    headers?: any;
  }) => {
    return axios
      .patch(getFullUrl(endpoint), params, {
        headers: headers || HEADERS,
        validateStatus: (status: any) => validateStatus(status),
      })
      .then(
        (response: any) => {
          if (checkExpiredOrAuthorization(response)) {
            throttledResetToLogin(endpoint, params, response);
            return checkErrorStatus(response?.data, options);
          }
          return checkErrorStatus(response, options);
        },
        (err: any) => {
          return (
            checkErrorStatus(err?.response, options) || checkErrorNetwork(err)
          );
        }
      )
      .catch((response: any) => {
        return response.data;
      });
  },

  patchMultipart: (endpoint: string, params?: any, options?: any) => {
    return axios
      .patch(getFullUrl(endpoint), params, {
        headers: HEADERS_MULTIPLE_PART,
        validateStatus: (status: any) => validateStatus(status),
      })
      .then(
        (response: any) => {
          if (checkExpiredOrAuthorization(response)) {
            throttledResetToLogin(endpoint, params, response);
            return checkErrorStatus(response?.data, options);
          }
          return checkErrorStatus(response, options);
        },
        (err: any) => {
          return (
            checkErrorStatus(err?.response, options) || checkErrorNetwork(err)
          );
        }
      )
      .catch((response: any) => {
        return response.data;
      });
  },

  delete: ({
    endpoint,
    params,
    options,
    headers,
  }: {
    endpoint: string;
    params?: any;
    options?: { [key: string]: any };
    headers?: any;
  }) => {
    return axios
      .patch(getFullUrl(endpoint), {
        headers: headers || HEADERS,
        params: {
          ...params,
        },
        validateStatus: (status: any) => validateStatus(status),
        ...(options || {}),
      })
      .then(
        (response: any) => {
          if (checkExpiredOrAuthorization(response)) {
            throttledResetToLogin(endpoint, params, response);
            return response?.data;
          }
          return checkErrorStatus(response, options);
        },
        (err: any) => {
          return (
            checkErrorStatus(err?.response, options) || checkErrorNetwork(err)
          );
        }
      )
      .catch((response: any) => {
        return response.data;
      });
  },
};

export { api };
