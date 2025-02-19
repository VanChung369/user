"use client";
import style from "./index.module.scss";
import React from "react";
import { Col, Row } from "antd";
import AppLink from "@/components/AppLink";
import { useIntl } from "react-intl";
import { useGetListCollections } from "../hooks";
import classNames from "classnames";
import ButtonWrapper from "@/components/ButtonWrapper";
import { useMobile } from "@/hooks/hook-customs/useWindowSize";
import { SELECT_DATA_COLLECTION } from "@/constants/collection";
import ROUTES_PATH, { QUERY } from "@/constants/routesPath";
import { MARKETPLACE_TABS } from "@/constants/marketplace";
import CollectionItem from "@/components/CollectionItem";

const Collections = () => {
  const intl = useIntl();
  const isMobile = useMobile();

  const limitData = isMobile
    ? SELECT_DATA_COLLECTION.MOBILE
    : SELECT_DATA_COLLECTION.DESKTOP;

  const { data } = useGetListCollections({ limit: limitData });

  return (
    <div className={classNames("container", style.collection)}>
      <div className={style.collection_box}>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between">
          <Col xs={24} sm={20} md={20} lg={20} xl={20} xxl={20}>
            <div className={style.collection_box__title}>
              {intl.formatMessage({ id: "home.banner.collection" })}
            </div>
            <div className={style.collection_box__title_content}>
              {intl.formatMessage({ id: "home.banner.collection.title" })}
            </div>
          </Col>

          <Col xs={24} sm={4} md={4} lg={4} xl={4} xxl={4}>
            <AppLink
              href={`${ROUTES_PATH.MARKETPLACE}?${QUERY.MARKET_PLACE_TAB_QUERY}=${MARKETPLACE_TABS.COLLECTIONS.type}`}
            >
              <ButtonWrapper
                className={style.collection_box__link}
                text={intl.formatMessage({
                  id: "home.banner.see.all",
                })}
              />
            </AppLink>
          </Col>
        </Row>
      </div>
      <div className="">
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          {data?.docs &&
            data.docs?.map((collection: any, index: any) => {
              return (
                <Col key={index} xs={24} sm={12} md={12} lg={8} xl={8} xxl={8}>
                  <AppLink
                    href={`${ROUTES_PATH.MARKETPLACE}?${QUERY.COLLECTION}=${collection?._id}`}
                  >
                    <CollectionItem key={index} collection={collection} />
                  </AppLink>
                </Col>
              );
            })}
        </Row>
      </div>
    </div>
  );
};

export default Collections;
