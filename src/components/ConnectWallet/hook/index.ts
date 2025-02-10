import { KEY_STORAGE } from "@/constants";
import { useAppDispatch } from "@/hooks";
import { handleSetAuthenticationToken } from "@/redux/authentication/slice";
import { login } from "@/services/api/auth";
import { setTokenCallApi } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";

export interface paramLogin {
  data: any;
  onSuccess: () => void;
  onError: () => void;
}

export const useLogin = () => {
  const dispatch = useAppDispatch();

  const handleLogin = useMutation({
    mutationFn: async (params: paramLogin) => {
      try {
        const response = await login(params.data);
        return response;
      } catch (error) {
        throw error;
      }
    },
    onError: (error, variables, context) => {
      variables.onError();
    },
    onSuccess: (data, variables, context) => {
      setTokenCallApi(data.data.token);
      Cookies.set(KEY_STORAGE, data.data.token, { sameSite: "strict" });
      dispatch(handleSetAuthenticationToken(data.data));
      variables.onSuccess();
    },
    onSettled: (data, error, variables, context) => {},
  });

  return {
    onLogin: handleLogin.mutate,
  };
};
