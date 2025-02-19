import React, { Fragment, useContext, useEffect, useState } from "react";
import { Tooltip } from "antd";
import classNames from "classnames";
import { LENGTH_CONSTANTS } from "@/constants";
import { useIntl } from "react-intl";
import { useAddress } from "@thirdweb-dev/react";
import { useGetConfig } from "@/hooks/hook-customs/useGetConfig";
import { useAppSelector } from "@/hooks";
import selectedConnection from "@/redux/connection/selector";
import { NftDetailContext } from "../../..";
import selectedAddress from "@/redux/address/selector";
import { useQueryClient } from "@tanstack/react-query";
import { NFT_STATUS } from "@/constants/nft";
import { EMPTY_DEFAULT_TEXT } from "@/constants/input";
import { useParams } from "next/navigation";
import ShortenAddress from "@/components/ShortenAddress";
import AppLink from "@/components/AppLink";
import { EXTERNAL_URL } from "@/constants/routesPath";
import TagWrapper from "@/components/TagWrapper";
import NumberFormatWrapper from "@/components/NumberFormatWrapper";
import { formatCurrency } from "@/utils/utils";
import { ExportOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import TableWrapper from "@/components/TableWrapper";
import style from "./index.module.scss";
import ListForSaleButton from "@/components/ListForSaleButton";
import RemoveFromSaleButton from "@/components/RemoveFromSaleButton";

const { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } = LENGTH_CONSTANTS;

const Owned = () => {
  const intl = useIntl();
  const account = useAddress();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { currency } = useGetConfig();
  const { isConnected } = useAppSelector(selectedConnection.getConnection);
  const { address } = useAppSelector(selectedAddress.getAddress);
  const {
    isCompletedBuy,
    isCompletedRemoveFromSale,
    isCompletedListForSale,
    onSetSelectedNFT,
    selectedNFT,
  } = useContext(NftDetailContext) as any;

  const nftId = Array.isArray(id) ? id[0] : id;
  const nftData: any = queryClient.getQueryData([
    "getNftDetail",
    nftId,
    address,
  ]);

  const nftOwned: any = queryClient.getQueryData(["getOwned", nftId, address]);

  const [params, setParams] = useState({
    page: DEFAULT_PAGE,
    limit: DEFAULT_PAGE_SIZE,
  }) as any;

  useEffect(() => {
    if (isConnected) {
      queryClient.refetchQueries({
        queryKey: ["getOwned"],
        type: "active",
      });
    }
  }, [params.page, params.limit]);

  useEffect(() => {
    if (
      (address && account) ||
      isCompletedBuy ||
      isCompletedListForSale ||
      isCompletedRemoveFromSale
    ) {
      queryClient.refetchQueries({
        queryKey: ["getOwned"],
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
      title: intl.formatMessage({ id: "NFT.detail.owned.token.id" }),
      dataIndex: "tokenId",
      key: "tokenId",
      width: 100,
      ellipsis: true,
      render: (value: any, row: any) => {
        const tokenAddress = nftData?.token?.address;
        return (
          <div className={style.token_id}>
            <ShortenAddress address={value} extraShort={false} />
            <AppLink
              href={`${EXTERNAL_URL.POLYGON_SCAN_TOKEN}/${tokenAddress}?a=${row?.tokenId}`}
              target="_blank"
              rel="noreferrer"
            >
              <ExportOutlined />
            </AppLink>
          </div>
        );
      },
    },

    {
      title: intl.formatMessage({ id: "NFT.detail.owned.price" }),
      width: 100,
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (value: any) => (
        <div>
          {value ? (
            <>
              <NumberFormatWrapper displayType="text" value={value} />
              &nbsp;
              <span>{currency?.symbol}</span>
            </>
          ) : (
            EMPTY_DEFAULT_TEXT
          )}
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: "NFT.detail.owned.quantity" }),
      width: 75,
      dataIndex: "quantity",
      key: "quantity",
      render: (value: any, row: any) => {
        const { status, isInvalid } = row;

        const renderQuantityOwner = () => {
          switch (true) {
            case isInvalid:
              return (
                <Fragment>
                  <NumberFormatWrapper
                    value={row?.quantityForSale}
                    displayType="text"
                  />
                  /
                  <NumberFormatWrapper value={value} displayType="text" />
                  <Tooltip
                    title={intl.formatMessage(
                      { id: "NFT.detail.owned.invalid.tooltip" },
                      {
                        onSaleQuantity: formatCurrency(row?.quantityForSale),
                        quantity: formatCurrency(row?.quantity),
                      }
                    )}
                  >
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Fragment>
              );
            case NFT_STATUS[0].value === status:
              return <NumberFormatWrapper value={value} displayType="text" />;
            default:
              return (
                <Fragment>
                  <NumberFormatWrapper
                    value={row?.quantityForSale}
                    displayType="text"
                  />
                  /
                  <NumberFormatWrapper value={value} displayType="text" />
                </Fragment>
              );
          }
        };

        return (
          <div
            className={classNames("table-column-quantity", {
              "text-primary": isInvalid,
            })}
          >
            {value ? renderQuantityOwner() : EMPTY_DEFAULT_TEXT}
          </div>
        );
      },
    },
    {
      title: intl.formatMessage({ id: "NFT.detail.owned.status" }),
      width: 75,
      dataIndex: "status",
      key: "status",
      render: (value: any) => {
        const status = NFT_STATUS.find(
          (status) => status?.value === value
        ) as any;
        return (
          <TagWrapper
            color={status?.color}
            text={intl.formatMessage({
              id: status?.name || "common.null.text",
            })}
          />
        );
      },
    },
    {
      title: intl.formatMessage({ id: "NFT.detail.owned.actions" }),
      width: 125,
      dataIndex: "status",
      key: "status",
      render: (value: any, row: any) => {
        const isOnsale = NFT_STATUS[1].value === value;
        const isOffSale = NFT_STATUS[0].value === value;

        return (
          <Fragment>
            <ListForSaleButton
              visibleButton={isOffSale}
              nft={{ ...nftData, ...row }}
              onSetSelectedNFT={onSetSelectedNFT}
              selectedNFT={selectedNFT}
            />

            <RemoveFromSaleButton
              visibleButton={isOnsale}
              nft={{ ...nftData, ...row }}
              onSetSelectedNFT={onSetSelectedNFT}
              selectedNFT={selectedNFT}
            />
          </Fragment>
        );
      },
    },
  ];

  const handleChangePaging = (page: number, pageSize: number) => {
    pageSize;
    setParams({
      ...params,
      page: pageSize !== limit ? LENGTH_CONSTANTS.DEFAULT_PAGE : page,
      limit: pageSize,
    });
  };

  return (
    <TableWrapper
      className={style.table_wrapper_owned}
      classNamePagination={style.pagination_wrapper_owned}
      simple={{ readOnly: true }}
      total={nftOwned?.totalDocs}
      columns={columns}
      dataSource={nftOwned?.docs}
      pageSize={limit}
      current={page}
      onChangePagination={handleChangePaging}
      rowKey={(row: any) => row?.tokenId}
      isPagination={true}
      emptyText={intl.formatMessage({ id: "common.text.no.data" })}
    />
  );
};

export default Owned;
