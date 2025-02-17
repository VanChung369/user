import React, { useContext, useEffect, useState } from "react";
import { TablePaginationConfig } from "antd";
import {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
} from "antd/lib/table/interface";
import { NFT_ACTIVITIES_FIELDS, NFT_SALE_ORDER_TYPE } from "@/constants/nft";
import { LENGTH_CONSTANTS } from "@/constants";
import { useIntl } from "react-intl";
import { useAddress } from "@thirdweb-dev/react";
import { NftDetailContext } from "../../..";
import selectedConnection from "@/redux/connection/selector";
import { useGetListing } from "../../../hooks";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/hooks";
import selectedAddress from "@/redux/address/selector";
import { SorterTable } from "@/types";
import NumberFormatWrapper from "@/components/NumberFormatWrapper";
import { DOLLAR_TEXT, EMPTY_DEFAULT_TEXT } from "@/constants/input";
import ShortenAddress from "@/components/ShortenAddress";
import { formatDate } from "@/utils/utils";
import BuyButton from "@/components/BuyButton";
import ButtonWrapper from "@/components/ButtonWrapper";
import { setOrderSorter } from "@/utils/sort";
import TableWrapper from "@/components/TableWrapper";
import style from "./index.module.scss";

const { PAGE, LIMIT } = NFT_ACTIVITIES_FIELDS;
const { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } = LENGTH_CONSTANTS;

const Listing = ({ isMySaleOrder }: { isMySaleOrder?: boolean }) => {
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

  const { data: listListing, loading: loadingListing } = useGetListing(
    nftId,
    params
  );

  const { isConnected } = useAppSelector(selectedConnection.getConnection);

  useEffect(() => {
    if (isRefreshSaleOrder) {
      queryClient.refetchQueries({
        queryKey: ["getListing"],
        type: "active",
      });
    }
  }, [isRefreshSaleOrder]);

  useEffect(() => {
    setParams({
      ...params,
      isMySaleOrder,
      page: DEFAULT_PAGE,
    });
  }, [isMySaleOrder]);

  useEffect(() => {
    if (
      (address && account) ||
      isCompletedBuy ||
      isCompletedListForSale ||
      isCompletedRemoveFromSale
    ) {
      queryClient.refetchQueries({
        queryKey: ["getListing"],
        type: "active",
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
      title: intl.formatMessage({ id: "NFT.detail.listing.price" }),
      dataIndex: "unitPrice",
      key: "unitPrice",
      width: 30,
      sorter: true,
      ellipsis: true,
      render: (_value: any, row: any) => {
        const { currency, unitPrice, usd } = row;
        return (
          <div>
            <NumberFormatWrapper displayType="text" value={unitPrice} />
            &nbsp;
            <span>{currency?.symbol}</span>
            <p className="usd">
              ~ {DOLLAR_TEXT} <NumberFormatWrapper value={usd} />
            </p>
          </div>
        );
      },
    },
    {
      title: intl.formatMessage({ id: "NFT.detail.quantity" }),
      width: 30,
      dataIndex: "remain",
      key: "remain",
      sorter: true,
      render: (value: any) => (
        <div>
          {value ? <NumberFormatWrapper value={value} /> : EMPTY_DEFAULT_TEXT}
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: "NFT.detail.listing.owner" }),
      width: 20,
      dataIndex: "fromAddress",
      key: "fromAddress",
      render: (_value: any, row: any) => {
        const { fromAddress, type } = row;
        const isYou = isConnected && fromAddress && address === fromAddress;
        const isAdmin = type === NFT_SALE_ORDER_TYPE.SELL;

        const renderAddressContent = () => {
          if (isYou) {
            return intl.formatMessage({ id: "NFT.detail.you" });
          } else if (isAdmin) {
            return intl.formatMessage({ id: "NFT.detail.admin" });
          } else return <ShortenAddress address={fromAddress} isCopy={false} />;
        };

        return (
          <div className="table-column-address">{renderAddressContent()}</div>
        );
      },
    },
    {
      title: intl.formatMessage({ id: "NFT.detail.listing.date" }),
      width: 30,
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      render: (value: any) => (
        <div className="table-column-date">{formatDate(value)}</div>
      ),
    },
    {
      title: intl.formatMessage({ id: "NFT.detail.action" }),
      width: 20,
      dataIndex: "fromAddress",
      key: "fromAddress",
      render: (value: any, row: any) => {
        const isYou = isConnected && address === value;
        const isProcessing = row?.isProcessing;
        return (
          <BuyButton
            nft={{ ...nftData, saleOrder: row }}
            onSetSelectedNFT={onSetSelectedNFT}
            selectedNFT={selectedNFT}
            visibleButton={true}
          >
            <ButtonWrapper
              className={style.button_buy}
              text={intl.formatMessage({ id: "NFT.detail.buy" })}
              disabled={isYou || isProcessing}
            />
          </BuyButton>
        );
      },
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
      total={listListing?.totalDocs}
      columns={columns}
      loading={loadingListing}
      dataSource={listListing?.docs}
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

export default Listing;
