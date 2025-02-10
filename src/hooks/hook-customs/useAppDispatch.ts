"use client";
import { AppDispatch } from "@/redux/configStore";
import { useDispatch } from "react-redux";

const useAppDispatch = () => useDispatch<AppDispatch>();

export default useAppDispatch;
