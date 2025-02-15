"use client";
import style from "./index.module.scss";
import React from "react";
import { Col, Row } from "antd";
import AppLink from "@/components/AppLink";
import { useIntl } from "react-intl";
import { useGetListTags } from "../hooks";
import TagItem from "./TagItem";
import classNames from "classnames";
import ROUTES_PATH, { QUERY } from "@/constants/routesPath";

const Tag = () => {
  const intl = useIntl();
  const limitData = 8;
  const { data } = useGetListTags({ limit: limitData });

  return (
    <div className={classNames("container", style.tag)}>
      <div className={style.tag_box}>
        <div className={style.tag_box__title}>
          {intl.formatMessage({ id: "home.banner.tag.browse.categories" })}
        </div>
      </div>
      <div>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          {data?.docs &&
            data.docs?.map((tag: any, index: any) => {
              return (
                <Col key={index} xs={24} sm={12} md={8} lg={8} xl={6} xxl={6}>
                  <AppLink
                    href={`${ROUTES_PATH.MARKETPLACE}?${QUERY.TAG}=${tag?._id}`}
                  >
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
