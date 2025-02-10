"use client";
import { RootState } from "@/redux/configStore";
import { shallowEqual, TypedUseSelectorHook, useSelector } from "react-redux";

const useAppSelector: TypedUseSelectorHook<RootState> = (state) =>
  useSelector(state, shallowEqual);
export default useAppSelector;
