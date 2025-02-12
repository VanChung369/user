"use client";
import style from "./index.module.scss";
import React from "react";
import { Col, Row } from "antd";
import AppLink from "@/components/AppLink";
import { useIntl } from "react-intl";
import { useGetListTags } from "../hooks";
import TagItem from "./TagItem";
import classNames from "classnames";

const Tag = () => {
  const intl = useIntl();
  const { data } = useGetListTags();
  const limitedData =
    data?.docs?.length > 8 ? data?.docs?.slice(0, 8) : data?.docs;

  return (
    <div className={classNames("container", style.tag)}>
      <div className={style.tag_box}>
        <div className={style.tag_box__title}>
          {intl.formatMessage({ id: "home.banner.tag.browse.categories" })}
        </div>
      </div>
      <div className="">
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          {limitedData &&
            limitedData?.map((tag: any, index: any) => {
              return (
                <Col key={index} md={6} xs={24}>
                  <AppLink href={"#"}>
                    <TagItem key={index} tag={tag} />
                  </AppLink>
                </Col>
              );
            })}
        </Row>
      </div>
    </div>
  );
};

export default Tag;
