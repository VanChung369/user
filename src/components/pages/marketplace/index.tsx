"use client";
import style from "./index.module.scss";
import React, { useEffect, useState } from "react";
import { Col, Row } from "antd";
import AppLink from "@/components/AppLink";
import { useIntl } from "react-intl";
import classNames from "classnames";
import Search from "./search";
import { LENGTH_CONSTANTS } from "@/constants";
import { MARKETPLACE_TABS, NFTS_SORTER } from "@/constants/marketplace";
import NFTs from "./NFTs";
import TabWapper from "@/components/TabWrapper";
import { useRouter, useSearchParams } from "next/navigation";
import { QUERY } from "@/constants/routesPath";
import Collections from "./Collection";
import { useQueryClient } from "@tanstack/react-query";

const { DEFAULT_PAGE } = LENGTH_CONSTANTS;

export const KEY_SEARCH = {
  KEYWORD: "keyword",
  PAGE: "page",
  SORT: "sort",
  COLLECTION: "collection",
  TAG: "tag",
  LIMIT: "limit",
  ISOWNED: "isOwned",
};

export const initialValues = {
  [KEY_SEARCH.KEYWORD]: "",
  [KEY_SEARCH.ISOWNED]: "",
  [KEY_SEARCH.COLLECTION]: "",
  [KEY_SEARCH.TAG]: "",
  [KEY_SEARCH.PAGE]: DEFAULT_PAGE,
  [KEY_SEARCH.SORT]: NFTS_SORTER[0].value,
};

const MarketPlace = () => {
  const intl = useIntl();
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const marketTab = searchParams.get(QUERY.MARKET_PLACE_TAB_QUERY);
  const collection = searchParams.get(QUERY.COLLECTION);
  const tag = searchParams.get(QUERY.TAG);

  const [params, setParams] = useState(initialValues);

  const [totalNfts, setTotalNfts] = useState(0);
  const [totalColections, setTotalCollections] = useState(0);

  const [activeTab, setActiveTab] = useState(
    marketTab || MARKETPLACE_TABS.NFTS.type
  );

  useEffect(() => {
    if (marketTab) {
      setActiveTab(marketTab);
    }

    setParams((prev) => ({
      ...prev,
      [KEY_SEARCH.COLLECTION]: collection ?? "",
      [KEY_SEARCH.TAG]: tag ?? "",
    }));
  }, [marketTab, activeTab, collection, tag]);

  const handleSubmit = (values: any) => {
    setParams({
      ...initialValues,
      ...values,
    });
  };

  const handleChangeTab = (value: string) => {
    setActiveTab(value);
    setParams(initialValues);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set(QUERY.MARKET_PLACE_TAB_QUERY, value);
    newUrl.searchParams.delete(QUERY.COLLECTION);
    newUrl.searchParams.delete(QUERY.TAG);
    router.replace(newUrl.toString());
  };

  const listTab = [
    {
      key: MARKETPLACE_TABS.NFTS.type,
      tab: intl.formatMessage(
        { id: MARKETPLACE_TABS.NFTS.label },
        { total: totalNfts }
      ),
      content: (
        <NFTs
          params={params}
          setTotalNfts={setTotalNfts}
          onSubmit={handleSubmit}
        />
      ),
    },
    {
      key: MARKETPLACE_TABS.COLLECTIONS.type,
      tab: intl.formatMessage(
        { id: MARKETPLACE_TABS.COLLECTIONS.label },
        { total: totalColections }
      ),
      content: (
        <Collections
          params={params}
          setTotalCollections={setTotalCollections}
          onSubmit={handleSubmit}
        />
      ),
    },
  ];

  return (
    <div className={classNames(style.marketplace)}>
      <div className={style.marketplace_banner}>
        <div className="container">
          <div className={style.marketplace_banner_info}>
            <div className={style.marketplace_banner_info_title}>
              {intl.formatMessage({
                id: "marketplace.banner.browse.marketplace",
              })}
            </div>
            <div className={style.marketplace_banner_info_content}>
              {intl.formatMessage({
                id: "marketplace.banner.browse.marketplace.title",
              })}
            </div>
          </div>

          <div className={style.marketplace_banner_search}>
            <Search params={params} onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
      <div className={style.marketplace_content}>
        <div className="container">
          <TabWapper
            onChangeTab={handleChangeTab}
            activeKey={activeTab}
            listTab={listTab}
          />
        </div>
      </div>
    </div>
  );
};

export default MarketPlace;
