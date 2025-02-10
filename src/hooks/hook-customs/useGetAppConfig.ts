"use client";
import { useEffect } from "react";
import useAppDispatch from "./useAppDispatch";
import { getConfig } from "@/services/api/config";
import { handleSetConfig } from "@/redux/config/slice";
import { checkSuccessRequest } from "@/services";

export function useGetAppConfig() {
  const dispatch = useAppDispatch();

  const handleGetConfig = async () => {
    try {
      const response = await getConfig();

      if (checkSuccessRequest(response)) {
        dispatch(handleSetConfig(response?.data));
      }
    } catch (error) {}
  };

  useEffect(() => {
    handleGetConfig();
  }, []);
}
