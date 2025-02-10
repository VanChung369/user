"use client";
import { useEmotionCss } from "@ant-design/use-emotion-css";
import { Dropdown } from "antd";
import type { DropDownProps } from "antd/es/dropdown";
import classNames from "classnames";
import React from "react";
import styles from "./index.module.scss";

export type HeaderDropdownProps = {
  overlayClassName?: string;
  overlay?: React.ReactNode | (() => React.ReactNode) | any;
  placement?:
    | "bottomLeft"
    | "bottomRight"
    | "topLeft"
    | "topCenter"
    | "topRight"
    | "bottomCenter";
  open?: boolean;
  onOpenChange?: (open: boolean, info: { source: "trigger" | "menu" }) => void;
} & Omit<DropDownProps, "overlay">;

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({
  overlayClassName: cls,
  ...restProps
}) => {
  const className = useEmotionCss(({ token }) => {
    return {
      [`@media screen and (max-width: ${token.screenXS})`]: {
        width: "100%",
      },
    };
  });
  return (
    <Dropdown overlayClassName={classNames(className, cls)} {...restProps} />
  );
};

export default HeaderDropdown;
