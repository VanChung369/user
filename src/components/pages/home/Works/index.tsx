"use client";
import style from "./index.module.scss";
import React from "react";
import { Col, Row } from "antd";
import { useIntl } from "react-intl";
import classNames from "classnames";
import WalletIcon from "@public/svg/Work_Icon.svg";
import CollectionIcon from "@public/svg/Collection_Icon.svg";
import EaringIcon from "@public/svg/Earning_Icon.svg";
import WorkItem from "./WorkItem";

const listWork = [
  {
    title: "home.banner.work.setup.your.wallet",
    description: "home.banner.work.setup.your.wallet.content",
    icon: WalletIcon,
  },
  {
    title: "home.banner.work.create.collection",
    description: "home.banner.work.create.collection.content",
    icon: CollectionIcon,
  },
  {
    title: "home.banner.work.start.earning",
    description: "home.banner.work.start.earning.content",
    icon: EaringIcon,
  },
];

const Work = () => {
  const intl = useIntl();

  return (
    <div className={classNames("container", style.work)}>
      <div className={style.work_box}>
        <Row>
          <Col md={24}>
            <div className={style.work_box__title}>
              {intl.formatMessage({ id: "home.banner.work" })}
            </div>
            <div className={style.work_box__title_content}>
              {intl.formatMessage({ id: "home.banner.work.title" })}
            </div>
          </Col>
        </Row>
      </div>
      <div>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          {listWork?.map((work: any, index: any) => {
            return (
              <Col key={index} md={8} xs={24}>
                <WorkItem key={index} work={work} />
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};

export default Work;
