import React from "react";
import { Tooltip } from "antd";
import classNames from "classnames";
import { QuestionCircleOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";

export type TextHelplProps = {
  label?: any;
  children?: any;
  className?: string;
  helpText?: string;
  contentClass?: string;
  labelClassName?: string;
  iconClassName?: string;
};

const TextHelp = ({
  label,
  children,
  className,
  helpText,
  contentClass,
  labelClassName,
  iconClassName,
}: TextHelplProps) => {
  return (
    <div className={classNames(styles.text, className)}>
      {label && (
        <span className={classNames(styles.text__lable, labelClassName)}>
          {label}
          {helpText && (
            <Tooltip title={helpText} overlayClassName="tooltip-detail">
              <QuestionCircleOutlined />
            </Tooltip>
          )}
        </span>
      )}
      <div className={classNames(styles.text__content, contentClass)}>
        {children}
      </div>
    </div>
  );
};

export default TextHelp;
