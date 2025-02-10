"use client";
import { metamaskWallet, useConnect } from "@thirdweb-dev/react";
import { useMemo } from "react";

const walletConfig = metamaskWallet();

export const useConnectWallet = () => {
  const connectWallet = useConnect();

  const connect = useMemo(() => {
    return {
      async handleConnect() {
        try {
          return await connectWallet(walletConfig);
        } catch (e) {
          console.error("failed to connect", e);
        }
      },
    };
  }, []);

  return connect;
};
