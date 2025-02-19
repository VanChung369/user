import React, { Fragment } from "react";
import { Tooltip } from "antd";
import { Formik } from "formik";
import noop from "lodash/noop";
import { useIntl } from "react-intl";
import { useGetConfig } from "@/hooks/hook-customs/useGetConfig";
import { useGetListSaleHistory } from "../hooks";
import { formatDate } from "@/utils/utils";
import ROUTES_PATH, { EXTERNAL_URL } from "@/constants/routesPath";
import ResponsiveImage from "@/components/ResponsiveImage";
import EllipsisText from "@/components/EllipsisText";
import { NFT_STANDARD } from "@/constants/nft";
import NumberWrapper from "@/components/NumberWrapper";
import { EMPTY_DEFAULT_TEXT } from "@/constants/input";
import AppLink from "@/components/AppLink";
import { initFormValues } from "..";
import ItemWithLabel from "@/components/ItemWithLabel";
import List from "../List";
import Search from "../search";
import style from "./index.module.scss";
import TypographyWrapper from "@/components/TypographyWrapper";
import { TYPE_TYPOGRAPHY } from "@/constants/type";

type SaleHistoryProps = {
  values: any;
  onSubmit: (values: any) => void;
};

const SaleHistory = ({ values, onSubmit }: SaleHistoryProps) => {
  const intl = useIntl();
  const { currency } = useGetConfig();
  const { data, loading } = useGetListSaleHistory(values);

  const columns = [
    {
      title: intl.formatMessage({ id: "account.no" }),
      dataIndex: "no",
      key: "no",
      width: 50,
      render: (_value: any, _row: any, index: number) =>
        (values.page - 1) * values.limit + index + 1,
    },
    {
      title: intl.formatMessage({ id: "account.sales.date" }),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 125,
      sorter: true,
      render: (value: any) => formatDate(value),
    },
    {
      title: intl.formatMessage({ id: "account.sales.nft.name" }),
      dataIndex: "nft.name",
      key: "nft.name",
      ellipsis: true,
      sorter: true,
      width: 100,
      render: (_value: string, row: any) => {
        return (
          <a
            href={`${ROUTES_PATH.NFT_DETAIL}/${row?.nft?.id}`}
            target="_blank"
            rel="noreferrer"
          >
            <div className={style.nft_name}>
              <ResponsiveImage src={row?.nft?.image?.smallUrl} />
              <EllipsisText text={row?.nft?.name} />
            </div>
          </a>
        );
      },
    },
    {
      title: intl.formatMessage({ id: "account.sales.type" }),
      dataIndex: "nft.token.standard",
      key: "nft.token.standard",
      width: 75,
      ellipsis: true,
      render: (_value: any, row?: any) => {
        const standard = NFT_STANDARD.find(
          (type) => type?.value === row?.nft?.token?.standard
        ) as any;
        return intl.formatMessage({
          id: standard?.label || "common.null.text",
        });
      },
    },
    {
      title: intl.formatMessage({ id: "account.sales.price" }),
      dataIndex: "saleOrder.unitPrice",
      key: "saleOrder.unitPrice",
      sorter: true,
      width: 75,
      render: (_value: number, row: any) => (
        <div>
          {row?.saleOrder?.unitPrice ? (
            <p className="symbol">
              <NumberWrapper
                thousandSeparator
                displayType="text"
                value={row?.saleOrder?.unitPrice}
              />
              &nbsp;
              <span>{row?.saleOrder?.currency?.symbol}</span>
            </p>
          ) : (
            EMPTY_DEFAULT_TEXT
          )}
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: "account.sales.quantity" }),
      dataIndex: "quantity",
      key: "quantity",
      sorter: true,
      width: 75,
      render: (value: number) => (
        <NumberWrapper thousandSeparator displayType="text" value={value} />
      ),
    },
    {
      title: intl.formatMessage({ id: "account.sales.royalties" }),
      dataIndex: "revenue",
      key: "revenue",
      sorter: true,
      width: 75,
      render: (value: number, row: any) => (
        <div>
          {value ? (
            <p className="symbol">
              <NumberWrapper
                thousandSeparator
                displayType="text"
                value={value}
              />
              &nbsp;
              <span>{row?.saleOrder?.currency?.symbol}</span>
            </p>
          ) : (
            EMPTY_DEFAULT_TEXT
          )}
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: "account.sales.profit" }),
      dataIndex: "profit",
      key: "profit",
      sorter: true,
      width: 75,
      render: (value: number, row: any) => (
        <div>
          {value ? (
            <p className="symbol">
              <NumberWrapper
                thousandSeparator
                displayType="text"
                value={value}
              />
              &nbsp;
              <span>{row?.saleOrder?.currency?.symbol}</span>
            </p>
          ) : (
            EMPTY_DEFAULT_TEXT
          )}
        </div>
      ),
    },
    {
      title: intl.formatMessage({
        id: "account.actions",
      }),
      width: 75,
      dataIndex: "hash",
      key: "hash",
      render: (value: any) =>
        value && (
          <Tooltip
            title={intl.formatMessage({
              id: "account.sales.view.on.polygon.scan",
            })}
            placement="topLeft"
          >
            <AppLink
              href={`${EXTERNAL_URL.POLYGON_SCAN}/${value}`}
              target="_blank"
              rel="noreferrer"
            >
              {intl.formatMessage({
                id: "account.sales.view.on.polygon.scan",
              })}
            </AppLink>
          </Tooltip>
        ),
    },
  ];

  return (
    <div className={style.sale_hisory_card}>
      <Formik initialValues={initFormValues} onSubmit={noop}>
        <Fragment>
          <Search params={values} onSubmit={onSubmit} />
          <TypographyWrapper
            typeTypography={TYPE_TYPOGRAPHY.TEXT_HELP}
            className={style.total_profit}
            label={intl.formatMessage({ id: "account.sales.total.profit" })}
          >
            <NumberWrapper
              thousandSeparator
              displayType="text"
              value={data?.totalProfit}
            />
            &nbsp;
            {currency?.symbol}
          </TypographyWrapper>

          <List
            data={data?.docs}
            loading={loading}
            columns={columns}
            total={data?.totalDocs}
            onSubmit={onSubmit}
            params={values}
          />
        </Fragment>
      </Formik>
    </div>
  );
};

export default SaleHistory;
