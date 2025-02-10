"use client";
import { useEffect } from "react";
import useAppSelector from "./useAppSelector";
import selectedAddress from "@/redux/address/selector";

type useChangeAddressProps = {
  callback: () => void;
};

export const useChangeAddress = ({ callback }: useChangeAddressProps) => {
  const { address } = useAppSelector(selectedAddress.getAddress);

  useEffect(() => {
    address && callback && callback();
  }, [address]);
};
