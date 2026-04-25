"use client";
import React from "react";
import { Carousel, Col, Row } from "antd";
import classNames from "classnames";
import { useIntl } from "react-intl";
import { useGetConfig } from "@/hooks/hook-customs/useGetConfig";
import { useGetOverview } from "../hooks";
import {
  compareSaleOrder,
  formatNumberWithSuffix,
  getNumber,
} from "@/utils/utils";
import { DashboardItem } from "./typing";
import ItemWithLabel from "@/components/ItemWithLabel";
import EllipsisText from "@/components/EllipsisText";
import { EMPTY_DEFAULT_TEXT } from "@/constants/input";
import AppLink from "@/components/AppLink";
import ButtonWrapper from "@/components/ButtonWrapper";
import Image from "next/image";
import style from "./index.module.scss";
import RocketLaunchIcon from "@public/svg/rocket-launch.svg";
import BannerGif from "@public/gif/banner.gif";
import SubSequent from "./SubSequent";
import ROUTES_PATH from "@/constants/routesPath";

const Banner = () => {
  const intl = useIntl();
  const { data } = useGetOverview();
  const { currency = {} } = useGetConfig();
  const { icon } = currency;

  if (data) {
    data.saleOrders && data.saleOrders.sort(compareSaleOrder);
  }

  const dashboardInfo: Array<DashboardItem> = [
    {
      label: intl.formatMessage({ id: "home.banner.total.items.sold" }),
      value: getNumber(data?.itemsSold),
    },
    {
      label: intl.formatMessage({ id: "home.banner.total.volume" }),
      value: getNumber(data?.totalVolume),
      icon: icon,
    },
    {
      label: intl.formatMessage({ id: "home.total.minters" }),
      value: getNumber(data?.totalMinters),
    },
  ];

  const renderDashboardItem = (item: DashboardItem = {}) => {
    const { label, subLabel, icon, value, className } = item;
    return (
      <ItemWithLabel
        label={label}
        contentClass={style.content}
        className={classNames(style.item, className)}
      >
        {icon && (
          <Image
            className={style.icon}
            src={icon}
            alt={"currency icon"}
            width={24}
            height={24}
          />
        )}
        {value ? (
          <EllipsisText
            className={style.text}
            text={formatNumberWithSuffix(value)}
          />
        ) : (
          EMPTY_DEFAULT_TEXT
        )}
        <span className={style.currency}>{subLabel}</span>
      </ItemWithLabel>
    );
  };

  return (
    <div className={style.home_banner}>
      <div className="container">
        <Carousel autoplay={true} autoplaySpeed={8000}>
          <div className={style.home_banner_content}>
            <Row gutter={24} justify="space-between" align="middle">
              <Col lg={14} md={14} sm={18}>
                <div className="intro">
                  <h1 className={style.home_banner_content__title}>
                    {intl.formatMessage({ id: "home.banner.title" })}
                  </h1>
                  <div className={style.home_banner_content__text}>
                    {intl.formatMessage({ id: "home.banner.text" })}
                  </div>
                  <AppLink href={ROUTES_PATH.MARKETPLACE}>
                    <ButtonWrapper
                      text={intl.formatMessage({
                        id: "home.banner.get.started",
                      })}
                      className={classNames(style.home_banner_content__button)}
                      prefixIcon={
                        <Image
                          src={RocketLaunchIcon}
                          alt={"rocketLaunch icon"}
                        />
                      }
                    />
                  </AppLink>
                  <div className={style.overview}>
                    <Row justify="space-between" align="middle">
                      <Col lg={5} md={24}>
                        {renderDashboardItem(dashboardInfo[0])}
                      </Col>
                      <div className={style.divider} />
                      <Col lg={6} md={24}>
                        {renderDashboardItem(dashboardInfo[1])}
                      </Col>
                      <div className={style.divider} />
                      <Col lg={6} md={24}>
                        {renderDashboardItem(dashboardInfo[2])}
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
              <Col lg={10} md={10} xs={24} className={style.image}>
                <Image
                  src={BannerGif}
                  width={370}
                  height={370}
                  alt="Picture of the author"
                />
              </Col>
            </Row>
          </div>
          {data?.saleOrders &&
            data.saleOrders.map((sale: any, index: any) => {
              return <SubSequent key={index} {...sale} />;
            })}
        </Carousel>
      </div>
    </div>
  );
};

export default Banner;
