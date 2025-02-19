import { useContext, useEffect, useRef } from "react";
import { SALE_STATUS_ORDER_VALUE } from "@/constants/saleOrder";
import { useIntl } from "react-intl";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/hooks";
import selectedAddress from "@/redux/address/selector";
import style from "./index.module.scss";
import AppLink from "@/components/AppLink";
import ROUTES_PATH, { QUERY } from "@/constants/routesPath";
import { formatText } from "@/utils/utils";
import { DOLLAR_TEXT, NFT_PERCENTAGE_SUFFIX } from "@/constants/input";
import selectedConnection from "@/redux/connection/selector";
import { useGetConfig } from "@/hooks/hook-customs/useGetConfig";
import { NFT_STATUS } from "@/constants/nft";
import { NftDetailContext } from "../..";
import EllipsisText from "@/components/EllipsisText";
import NumberFormatWrapper from "@/components/NumberFormatWrapper";
import ButtonWrapper from "@/components/ButtonWrapper";
import BuyButton from "@/components/BuyButton";
import { MARKETPLACE_TABS } from "@/constants/marketplace";
import Image from "next/image";
import Tags from "../Tag";

const { SOLD_OUT, LISTED, DELISTED, COMING_SOON } = SALE_STATUS_ORDER_VALUE;

const Info = () => {
  const intl = useIntl();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const nftId = Array.isArray(id) ? id[0] : id;
  const { address } = useAppSelector(selectedAddress.getAddress);
  const { isConnected } = useAppSelector(selectedConnection.getConnection);
  const { currency = {} } = useGetConfig();
  const { symbol, icon } = currency;
  const nftData: any = queryClient.getQueryData([
    "getNftDetail",
    nftId,
    address,
  ]);
  const ownedData: any = queryClient.getQueryData(["getOwned", nftId, address]);
  const { isRefreshSaleOrder, selectedNFT, onSetSelectedNFT } = useContext(
    NftDetailContext
  ) as any;

  const isForSale = nftData?.status === NFT_STATUS[1].value;
  const isYou = isConnected && address === nftData?.saleOrder?.fromAddress;
  const isProcessing = nftData?.saleOrder?.isProcessing;

  useEffect(() => {
    if (isRefreshSaleOrder) {
      queryClient.refetchQueries({
        queryKey: ["getNftDetail"],
        type: "active",
      });
    }
  }, [isRefreshSaleOrder]);

  return (
    <div className={style.nft_detail_info}>
      <div className={style.nft_detail_info_code}>
        <p className={style.nft_detail_info_code_text}>
          {formatText(nftData?.code)}
        </p>
      </div>
      <div className={style.nft_detail_info_collection}>
        <div className={style.nft_detail_info_collection_text}>
          <AppLink
            href={`${ROUTES_PATH.MARKETPLACE}?${QUERY.COLLECTION}=${nftData?.collection.id[0]}&${QUERY.MARKET_PLACE_TAB_QUERY}=${MARKETPLACE_TABS.NFTS.type}`}
          >
            <EllipsisText text={nftData?.collection.name[0]} />
          </AppLink>
        </div>
      </div>
      <div className={style.nft_detail_info_name}>
        <EllipsisText text={nftData?.name} />
      </div>

      <div className={style.nft_detail_info_sale}>
        <div className={style.nft_detail_info_sale_item}>
          <p className={style.nft_detail_info_sale_item_label}>
            {intl.formatMessage({ id: "NFT.detail.for.sale.and.total.supply" })}
          </p>
          <p className={style.nft_detail_info_sale_item_text}>
            <NumberFormatWrapper value={nftData?.totalForSale} />/
            <NumberFormatWrapper value={nftData?.token?.totalSupply} />
          </p>
        </div>
        <div className={style.nft_detail_info_sale_item}>
          <p className={style.nft_detail_info_sale_item_label}>
            {intl.formatMessage({ id: "NFT.detail.owned" })}
          </p>
          <p className={style.nft_detail_info_sale_item_text}>
            <NumberFormatWrapper
              value={ownedData?.totalQuantity ? ownedData?.totalQuantity : 0}
            />
          </p>
        </div>
        <div className={style.nft_detail_info_sale_item}>
          <p className={style.nft_detail_info_sale_item_label}>
            {intl.formatMessage({ id: "NFT.detail.royalties" })}
          </p>
          <p className={style.nft_detail_info_sale_item_text}>
            <NumberFormatWrapper
              value={nftData?.royaltyFee}
              suffix={NFT_PERCENTAGE_SUFFIX}
            />
          </p>
        </div>
      </div>
      <div className={style.nft_detail_info_tag}>
        <Tags />
      </div>
      <div>
        <EllipsisText
          className={style.nft_detail_info_description}
          text={nftData?.description}
        />
      </div>

      <div className={style.nft_detail_info_footer}>
        <div className={style.nft_detail_info_footer_active}>
          {isForSale && (
            <div className={style.nft_detail_info_footer_active__top}>
              <div className={style.nft_detail_info_footer_active_currency}>
                <Image
                  src={icon}
                  className={style.nft_detail_info_footer_active_currency__icon}
                  alt={"icon"}
                  width={25}
                  height={25}
                />
                <NumberFormatWrapper
                  className={
                    style.nft_detail_info_footer_active_currency__price
                  }
                  displayType="text"
                  value={nftData?.saleOrder?.unitPrice}
                />
                <span
                  className={
                    style.nft_detail_info_footer_active__top_currency__symbol
                  }
                >
                  {symbol}
                </span>
                <span
                  className={style.nft_detail_info_footer_active_currency__usd}
                >
                  (
                  <NumberFormatWrapper
                    value={nftData?.saleOrder?.usd}
                    decimalScale={8}
                  />
                  {DOLLAR_TEXT})
                </span>
              </div>
            </div>
          )}
          {nftData && (
            <BuyButton
              nft={nftData}
              selectedNFT={selectedNFT}
              onSetSelectedNFT={onSetSelectedNFT}
              isRefreshNFT
              visibleButton={isForSale}
            >
              <ButtonWrapper
                text={intl.formatMessage({ id: "NFT.detail.buy.now" })}
                className={style.buy_button}
                disabled={isYou || isProcessing}
              />
            </BuyButton>
          )}

          {!isForSale && (
            <div className={style.not_for_sale}>
              {intl.formatMessage({ id: "NFT.detail.not.for.sale" })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Info;
