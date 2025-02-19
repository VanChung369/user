"use client";
import style from "./index.module.scss";
import React, { useEffect, useState } from "react";
import { Col, Row } from "antd";
import { useIntl } from "react-intl";
import classNames from "classnames";
import { LENGTH_CONSTANTS } from "@/constants";
import NFTs from "./NFTs";
import TabWapper from "@/components/TabWrapper";
import Image from "next/image";
import ImageAccount from "@public/images/Image_account.png";
import ProfileIcon from "@public/images/no-profile-md.png";
import { ACCOUNT_TABS } from "@/constants/account";
import ShortenAddress from "@/components/ShortenAddress";
import selectedAddress from "@/redux/address/selector";
import { useAppSelector } from "@/hooks";
import { DashboardItem } from "../home/Banner/typing";
import { formatNumberWithSuffix, getNumber } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import ItemWithLabel from "@/components/ItemWithLabel";
import EllipsisText from "@/components/EllipsisText";
import { EMPTY_DEFAULT_TEXT } from "@/constants/input";
import { NFT_ACTIVITIES_FIELDS } from "@/constants/nft";
import SaleHistory from "./SaleHistory";
import PurchaseHistory from "./PurchaseHistory";

const { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } = LENGTH_CONSTANTS;
const { FROM, KEYWORD, UNTIL, TYPE, PAGE, LIMIT } = NFT_ACTIVITIES_FIELDS;

export const initFormValues = {
  [FROM]: "",
  [UNTIL]: "",
  [TYPE]: null,
  [KEYWORD]: "",
  [PAGE]: DEFAULT_PAGE,
  [LIMIT]: DEFAULT_PAGE_SIZE,
};

const MyAccount = () => {
  const intl = useIntl();
  const { address } = useAppSelector(selectedAddress.getAddress);
  const [dataNft, setDataNft] = useState<any>();

  const [activeTab, setActiveTab] = useState(ACCOUNT_TABS.OWNED.type);

  const [purchaseHistoryTab, setPurchaseHistoryTab] = useState({
    ...initFormValues,
  });
  const [saleHistoryTab, setSaleHistoryTab] = useState({
    ...initFormValues,
  });

  const ownedInfo: Array<DashboardItem> = [
    {
      label: intl.formatMessage({ id: "account.sales.total.owned" }),
      value: getNumber(dataNft?.totalDocs),
    },
    {
      label: intl.formatMessage({ id: "account.sales.total.total.not.sale" }),
      value: getNumber(dataNft?.totalNotForSale),
    },
    {
      label: intl.formatMessage({ id: "account.sales.total.total.sale" }),
      value: getNumber(dataNft?.totalForSale),
    },
  ];

  const renderOwnedItem = (item: DashboardItem = {}) => {
    const { label, subLabel, icon, value, className } = item;
    return (
      <ItemWithLabel
        label={label}
        contentClass={style.content}
        className={classNames(style.item, className)}
      >
        {value ? (
          <EllipsisText
            className={style.text}
            text={formatNumberWithSuffix(value)}
          />
        ) : (
          EMPTY_DEFAULT_TEXT
        )}
      </ItemWithLabel>
    );
  };

  const handleSubmit = (values: any) => {
    const fncTab =
      activeTab === ACCOUNT_TABS.PURCHASE.type
        ? setPurchaseHistoryTab
        : setSaleHistoryTab;
    const objTab =
      activeTab === ACCOUNT_TABS.PURCHASE.type
        ? purchaseHistoryTab
        : saleHistoryTab;
    fncTab({
      ...objTab,
      ...values,
    });
  };

  const handleChangeTab = (value: string) => {
    setActiveTab(value);
  };

  const listTab = [
    {
      key: ACCOUNT_TABS.OWNED.type,
      tab: intl.formatMessage({ id: ACCOUNT_TABS.OWNED.label }),
      content: <NFTs setDataNft={setDataNft} />,
    },
    {
      key: ACCOUNT_TABS.PURCHASE.type,
      tab: intl.formatMessage({ id: ACCOUNT_TABS.PURCHASE.label }),
      content: (
        <PurchaseHistory values={purchaseHistoryTab} onSubmit={handleSubmit} />
      ),
    },
    {
      key: ACCOUNT_TABS.SALE.type,
      tab: intl.formatMessage({ id: ACCOUNT_TABS.SALE.label }),
      content: <SaleHistory values={saleHistoryTab} onSubmit={handleSubmit} />,
    },
  ];

  return (
    <div className={classNames(style.account)}>
      <div className={style.account_image}>
        <Image
          src={ImageAccount}
          alt="Account"
          className={style.account_image_background}
        />
      </div>
      <div className={style.account_banner}>
        <div className="container">
          <div className={style.account_banner_image}>
            <Image
              className={style.account_banner_image_artist_avatar}
              src={ProfileIcon}
              alt="Avatar Placeholder"
            />
          </div>
          <div className={style.account_banner_info}>
            <div className={style.account_banner_info_title}>
              <ShortenAddress address={address} />
            </div>
            <div className={style.account_banner_info_content}>
              <div className={style.account_banner_info_content_overview}>
                <Row justify="space-between">
                  <Col lg={8} md={24}>
                    {renderOwnedItem(ownedInfo[0])}
                  </Col>
                  <div className={style.divider} />
                  <Col lg={8} md={24}>
                    {renderOwnedItem(ownedInfo[1])}
                  </Col>
                  <div className={style.divider} />
                  <Col lg={8} md={24}>
                    {renderOwnedItem(ownedInfo[2])}
                  </Col>
                </Row>
              </div>
            </div>
            <div className={style.account_banner_info_bio}>
              <div className={style.account_banner_info_bio_lable}>
                {intl.formatMessage({ id: "account.bio" })}
              </div>
              <div className={style.account_banner_info_bio_text}>
                {intl.formatMessage({ id: "account.bio.title" })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={style.account_content}>
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

export default MyAccount;
