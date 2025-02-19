import React, { useContext, useEffect, useState } from "react";
import { TablePaginationConfig } from "antd";
import {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
} from "antd/lib/table/interface";
import {
  NFT_ACTIVITIES_FIELD_SORTER,
  NFT_ACTIVITIES_FIELDS,
  NFT_SALE_ORDER_TYPE,
  NFT_TRANSACTION_EVENT,
} from "@/constants/nft";
import { LENGTH_CONSTANTS } from "@/constants";
import { useIntl } from "react-intl";
import { useAddress } from "@thirdweb-dev/react";
import { NftDetailContext } from "../../..";
import selectedConnection from "@/redux/connection/selector";
import { useGetActivities } from "../../../hooks";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/hooks";
import selectedAddress from "@/redux/address/selector";
import { SorterTable } from "@/types";
import { EMPTY_DEFAULT_TEXT } from "@/constants/input";
import ShortenAddress from "@/components/ShortenAddress";
import { formatDate } from "@/utils/utils";
import { setOrderSorter } from "@/utils/sort";
import TableWrapper from "@/components/TableWrapper";
import NumberWrapper from "@/components/NumberWrapper";
import style from "./index.module.scss";

const { PAGE, LIMIT } = NFT_ACTIVITIES_FIELDS;
const { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } = LENGTH_CONSTANTS;
const {
  QUANTITY,
  TYPE,
  CREATED_AT,
  TO_ADDRESS,
  FROM_ADDRESS,
  UNIT_PRICE,
  HASH,
} = NFT_ACTIVITIES_FIELD_SORTER;

const Activities = ({ isMyHistory }: { isMyHistory?: boolean }) => {
  const intl = useIntl();
  const account = useAddress();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const nftId = Array.isArray(id) ? id[0] : id;
  const { address } = useAppSelector(selectedAddress.getAddress);
  const nftData: any = queryClient.getQueryData([
    "getNftDetail",
    nftId,
    address,
  ]);

  const {
    isCompletedBuy,
    isCompletedRemoveFromSale,

    isCompletedListForSale,
    isRefreshSaleOrder,
    onSetSelectedNFT,
    selectedNFT,
  } = useContext(NftDetailContext) as any;

  const [params, setParams] = useState({
    [PAGE]: DEFAULT_PAGE,
    [LIMIT]: DEFAULT_PAGE_SIZE,
  }) as any;

  const { data: listActivities, loading: loadingActivities } = useGetActivities(
    nftId,
    params
  );

  const { isConnected } = useAppSelector(selectedConnection.getConnection);

  useEffect(() => {
    setParams({
      ...params,
      isMyHistory,
      page: DEFAULT_PAGE,
    });
  }, [isMyHistory]);

  useEffect(() => {
    if (
      (address && account) ||
      isCompletedBuy ||
      isCompletedListForSale ||
      isCompletedRemoveFromSale
    ) {
      setParams({
        ...params,
        page: DEFAULT_PAGE,
      });
    }
  }, [
    address,
    account,
    isCompletedListForSale,
    isCompletedBuy,
    isCompletedRemoveFromSale,
  ]);

  const { limit, page } = params;

  const columns = [
    {
      title: intl.formatMessage({ id: "NFT.detail.activities.event" }),
      dataIndex: TYPE,
      key: TYPE,
      width: 30,
      render: (value: any) => {
        const event = NFT_TRANSACTION_EVENT.find(
          (event) => event?.value === value
        ) as any;
        return (
          <div className="table-column-event">
            {intl.formatMessage({ id: event?.label })}
          </div>
        );
      },
    },
    {
      title: intl.formatMessage({ id: "NFT.detail.activities.price" }),
      width: 50,
      dataIndex: UNIT_PRICE,
      key: UNIT_PRICE,
      ellipsis: true,
      sorter: true,
      render: (_value: any, row: any) => {
        const { saleOrder = {} } = row;
        const { currency, unitPrice } = saleOrder;
        return (
          <div>
            <NumberWrapper
              thousandSeparator
              displayType="text"
              value={unitPrice}
            />
            &nbsp;
            <span>{currency?.symbol}</span>
          </div>
        );
      },
    },
    {
      title: intl.formatMessage({ id: "NFT.detail.activities.quantity" }),
      width: 50,
      dataIndex: QUANTITY,
      key: QUANTITY,
      sorter: true,
      render: (value: any) => (
        <div>
          {value ? (
            <NumberWrapper value={value} displayType="text" />
          ) : (
            EMPTY_DEFAULT_TEXT
          )}
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: "NFT.detail.activities.from" }),
      width: 30,
      dataIndex: FROM_ADDRESS,
      key: FROM_ADDRESS,
      ellipsis: true,
      render: (_value: any, row: any) => {
        const { fromAddress, saleOrder = {} } = row;
        const isYou = isConnected && fromAddress && address === fromAddress;
        const isAdmin = saleOrder?.type === NFT_SALE_ORDER_TYPE.SELL;

        const renderAddressContent = () => {
          if (isYou) {
            return intl.formatMessage({ id: "NFT.detail.you" });
          } else if (isAdmin) {
            return intl.formatMessage({ id: "NFT.detail.admin" });
          } else return <ShortenAddress address={fromAddress} isCopy={false} />;
        };

        return <div>{renderAddressContent()}</div>;
      },
    },
    {
      title: intl.formatMessage({ id: "NFT.detail.activities.to" }),
      width: 50,
      dataIndex: TO_ADDRESS,
      key: TO_ADDRESS,
      ellipsis: true,
      render: (_value: any, row: any) => {
        const { toAddress, type } = row;
        const isYou = isConnected && toAddress && address === toAddress;
        const isAdmin = type === NFT_SALE_ORDER_TYPE.SELL;
        const renderAddressContent = () => {
          if (isYou) {
            return intl.formatMessage({ id: "NFT.detail.you" });
          } else if (isAdmin) {
            return intl.formatMessage({ id: "NFT.detail.admin" });
          } else return <ShortenAddress address={toAddress} isCopy={false} />;
        };

        return <div>{renderAddressContent()}</div>;
      },
    },
    {
      title: intl.formatMessage({ id: "NFT.detail.activities.date" }),
      width: 75,
      key: CREATED_AT,
      dataIndex: CREATED_AT,
      sorter: true,
      render: (value: any) => <div>{formatDate(value)}</div>,
    },
  ];

  const handleChangePaging = (page: number, pageSize: number) => {
    pageSize;
    setParams({
      ...params,
      page: pageSize !== limit ? DEFAULT_PAGE : page,
      limit: pageSize,
    });
  };

  const handleChangeTable = (
    _pagination: TablePaginationConfig,
    _filter: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
    _extra: TableCurrentDataSource<any>
  ) => {
    const { order, field } = sorter as SorterTable;
    const newOrder = setOrderSorter(order);
    setParams({
      ...params,
      field,
      order: newOrder,
      page: DEFAULT_PAGE,
    });
  };

  return (
    <TableWrapper
      className={style.table_wrapper_activities}
      classNamePagination={style.pagination_wrapper_activities}
      simple={{ readOnly: true }}
      total={listActivities?.totalDocs}
      columns={columns}
      loading={loadingActivities}
      dataSource={listActivities?.docs}
      pageSize={limit}
      current={page}
      onChangePagination={handleChangePaging}
      rowKey={(row: any) => row?._id}
      onChange={handleChangeTable}
      scroll={{ x: 784 }}
      isPagination={true}
      emptyText={intl.formatMessage({ id: "common.text.no.data" })}
    />
  );
};

export default Activities;
