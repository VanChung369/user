import React from "react";
import { Button } from "antd";
import classNames from "classnames";
import { ButtonWrapperProps } from "./typings";
import style from "./index.module.scss";

function ButtonWrapper({
  variant = "default",
  prefixIcon,
  afterIcon,
  text,
  className,
  ...props
}: ButtonWrapperProps) {
  return (
    <Button
      className={classNames(style.button, [style[`button--${variant}`]], {
        [`${className}`]: !!className,
      })}
      {...props}
    >
      {prefixIcon}
      <span>{text}</span>
      {afterIcon}
    </Button>
  );
}

export default ButtonWrapper;
