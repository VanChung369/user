import { Spin } from "antd";
import React from "react";
import { LoadingWrapperProps } from "./typing";
import { LoadingOutlined } from "@ant-design/icons";
import style from "./index.module.scss";

const LoadingWrapper = ({ loading, children }: LoadingWrapperProps) => {
  return (
    <Spin
      className={style.loading}
      spinning={loading}
      indicator={<LoadingOutlined className={style.loading__icon} />}
    >
      {children}
    </Spin>
  );
};

export default LoadingWrapper;
