"use client";
import { FC } from "react";
import { FloatButton } from "antd";
import ChevronUpIcon from "@public/svg/chevron_up_icon.svg";
import AppSeo from "@/components/AppSeo";
import LoadingWrapper from "@/components/LoadingWrapper";
import Header from "../Header";
import style from "./index.module.scss";
import Footer from "../Footer";
import { UpOutlined } from "@ant-design/icons";

const LayoutPublic: FC<{
  children: any;
  title?: string;
  className?: string;
  notShowFooter?: boolean;
  notShowHeader?: boolean;
  socialImageUrl?: string;
  metaDescription?: string;
  faviconImageUrl?: string;
}> = ({
  children,
  className,
  title = "",
  notShowFooter,
  notShowHeader,
  socialImageUrl,
  faviconImageUrl,
  metaDescription,
}) => {
  return (
    <LoadingWrapper loading={false}>
      <AppSeo
        title={title}
        socialImageUrl={socialImageUrl}
        faviconImageUrl={faviconImageUrl}
        metaDescription={metaDescription}
      />
      <div className={className}>
        {!notShowHeader && <Header />}
        <div className={style.content}>
          <FloatButton.BackTop
            icon={<UpOutlined style={{ color: "white" }} />}
          />
          {children}
        </div>

        {!notShowFooter && <Footer />}
      </div>
    </LoadingWrapper>
  );
};

export default LayoutPublic;
