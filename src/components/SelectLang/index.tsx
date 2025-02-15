// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Menu, version, Dropdown } from "antd";
import { ClickParam } from "antd/es/menu";
import { DropDownProps } from "antd/es/dropdown";
import LanguageIcon from "@public/svg/language_icon.svg";
import styles from "./index.module.scss";
import Image from "next/image";

export interface HeaderDropdownProps extends DropDownProps {
  overlayClassName?: string;
  placement?:
    | "bottomLeft"
    | "bottomRight"
    | "topLeft"
    | "topCenter"
    | "topRight"
    | "bottomCenter";
}

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({
  overlayClassName: cls,
  ...restProps
}) => <Dropdown overlayClassName={cls} {...restProps} />;

interface LocalData {
  lang: string;
  label?: string;
  icon?: string;
  title?: string;
}

interface SelectLangProps {
  globalIconClassName?: string;
  postLocalesData?: (locales: LocalData[]) => LocalData[];
  onItemClick?: (params: ClickParam) => void;
  className?: string;
  reload?: boolean;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

const getLocale = () => {
  return localStorage.getItem("language") || "en";
};

const setLocale = (locale: string, reload = false) => {
  localStorage.setItem("language", locale);
  if (reload) {
    window.location.reload();
  }
};

const getAllLocales = () => {
  return Object.keys(defaultLangUConfigMap);
};

const defaultLangUConfigMap = {
  "en-US": {
    lang: "en",
    label: "English",
    icon: "🇺🇸",
    title: "Language",
  },
  "vi-VN": {
    lang: "vi",
    label: "Tiếng Việt",
    icon: "🇻🇳",
    title: "Ngôn ngữ",
  },
};

export const SelectLang: React.FC<SelectLangProps> = (props) => {
  const {
    globalIconClassName,
    postLocalesData,
    onItemClick,
    icon,
    style,
    reload,
    ...restProps
  } = props;

  const [selectedLang, setSelectedLang] = useState(getLocale());

  useEffect(() => {
    setSelectedLang(getLocale());
  }, []);

  const changeLang = ({ key }: ClickParam): void => {
    setLocale(key, true);
    setSelectedLang(getLocale());
  };

  const allLangUIConfig =
    postLocalesData?.(Object.values(defaultLangUConfigMap)) ||
    Object.values(defaultLangUConfigMap);
  const handleClick = onItemClick
    ? (params: ClickParam) => onItemClick(params)
    : changeLang;

  const menuItemStyle = { minWidth: "160px" };
  const menuItemIconStyle = { marginRight: "8px" };

  const langMenu = {
    selectedKeys: [selectedLang],
    onClick: handleClick,
    items: allLangUIConfig.map((localeObj) => ({
      key: localeObj.lang,
      style: menuItemStyle,
      label: (
        <>
          <span
            role="img"
            aria-label={localeObj?.label || "en-US"}
            style={menuItemIconStyle}
          >
            {localeObj?.icon || "🌐"}
          </span>
          {localeObj?.label || "en-US"}
        </>
      ),
    })),
  };

  const dropdownProps = { menu: langMenu };

  const inlineStyle = {
    cursor: "pointer",
    padding: "12px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    fontFamily: "Poppins",
    verticalAlign: "middle",
    ...style,
  };

  return (
    <HeaderDropdown {...dropdownProps} placement="bottomRight" {...restProps}>
      <span className={globalIconClassName} style={inlineStyle}>
        <i
          className="anticon"
          title={allLangUIConfig.find((l) => l.lang === selectedLang)?.title}
        >
          <Image
            src={LanguageIcon}
            className={styles.language_icon}
            alt={"language icon"}
          />
        </i>
      </span>
    </HeaderDropdown>
  );
};
