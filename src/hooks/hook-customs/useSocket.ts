"use client";
import { useEffect } from "react";
import { isArray } from "lodash";
import useAppSelector from "./useAppSelector";
import selectedAddress from "@/redux/address/selector";
import Socket from "@/services/socket";

export const useSocket = ({
  event,
  handleEvent,
  dependences,
  nonAuthen = false,
}: {
  event: string | string[];
  handleEvent: any;
  dependences?: any;
  nonAuthen?: boolean;
}) => {
  const { address } = useAppSelector(selectedAddress.getAddress);
  const socketInstance = new Socket().getInstance(address);

  useEffect(() => {
    const shouldListen = address || nonAuthen;

    if (shouldListen) {
      if (typeof event === "string") {
        socketInstance.on(event, handleEvent);
      } else if (isArray(event)) {
        event.forEach((e: string) => {
          socketInstance.on(e, handleEvent);
        });
      }
    }

    return () => {
      if (shouldListen) {
        if (typeof event === "string") {
          socketInstance.off(event, handleEvent);
        } else if (isArray(event)) {
          event.forEach((e: string) => {
            socketInstance.off(e, handleEvent);
          });
        }
      }
    };
  }, [address, ...(dependences || []), event, handleEvent, nonAuthen]);
};
