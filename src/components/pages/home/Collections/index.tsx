"use client";
import style from "./index.module.scss";
import React, { useEffect } from "react";
import { Col, Row } from "antd";
import AppLink from "@/components/AppLink";
import { useIntl } from "react-intl";
import { useGetListCollections } from "../hooks";
import CollectionItem from "./CollectionItem";
import classNames from "classnames";
import ButtonWrapper from "@/components/ButtonWrapper";

const Collections = () => {
  const intl = useIntl();
  const { data } = useGetListCollections();
  const limitedData =
    data?.docs?.length > 3 ? data?.docs?.slice(0, 3) : data?.docs;

  return (
    <div className={classNames("container", style.collection)}>
      <div className={style.collection_box}>
        <Row>
          <Col md={20}>
            <div className={style.collection_box__title}>
              {intl.formatMessage({ id: "home.banner.collection" })}
            </div>
            <div className={style.collection_box__title_content}>
              {intl.formatMessage({ id: "home.banner.collection.title" })}
            </div>
          </Col>

          <Col md={4}>
            <AppLink href={"#"}>
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
          {limitedData &&
            limitedData?.map((collection: any, index: any) => {
              return (
                <Col key={index} md={8} xs={24}>
                  <AppLink href={"#"}>
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
