import React from "react";
import { Tooltip } from "antd";
import classNames from "classnames";
import style from "./index.module.scss";
import { QuestionCircleOutlined } from "@ant-design/icons";

type ItemWithLabelProps = {
  label?: any;
  children?: any;
  className?: string;
  helpText?: string;
  contentClass?: string;
  labelClassName?: string;
  iconClassName?: string;
};

const ItemWithLabel = ({
  label,
  children,
  className,
  helpText,
  contentClass,
  labelClassName,
  iconClassName,
}: ItemWithLabelProps) => {
  return (
    <div className={classNames(style.item, className)}>
      {label && (
        <span className={classNames(style.item__label, labelClassName)}>
          {label}
          {helpText && (
            <Tooltip title={helpText} overlayClassName="tooltip-detail">
              <QuestionCircleOutlined className={style.item__icon} />
            </Tooltip>
          )}
        </span>
      )}
      <div className={classNames(style.item__content, contentClass)}>
        {children}
      </div>
    </div>
  );
};

export default ItemWithLabel;
