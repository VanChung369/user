import React from "react";
import { Tabs } from "antd";
import classNames from "classnames";
import style from "./index.module.scss";
import { TabsProps } from "./typings";

interface Tab {
  key: string;
  tab: string;
  content: any;
  className?: string;
  disabled?: boolean;
  [key: string]: any;
}

const TabWapper = ({
  listTab,
  onChangeTab,
  className,
  disabled,
  ...props
}: TabsProps) => {
  return (
    <Tabs
      className={classNames(style.tab, className)}
      onChange={onChangeTab}
      items={listTab.map(({ content, key, tab, disabled }: Tab) => {
        return {
          label: tab,
          key: key,
          children: content,
          disabled: disabled,
        };
      })}
      {...props}
    />
  );
};

export default TabWapper;
