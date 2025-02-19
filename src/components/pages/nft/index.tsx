"use client";
import style from "./index.module.scss";
import React, {
  createContext,
  Fragment,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useIntl } from "react-intl";
import classNames from "classnames";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useGetListing, useGetNftDetail, useGetOwned } from "./hooks";
import Header from "./Header";
import General from "./General";
import { useAppDispatch, useAppSelector } from "@/hooks";
import selectedAction from "@/redux/action/selector";
import {
  BUY_STEPS,
  LIST_FOR_SALE_STEPS,
  REMOVE_FROM_SALE_STEPS,
} from "@/constants/nft";
import {
  handleSetBuyStep,
  handleSetListForSaleStep,
  handleSetRemoveFromSaleStep,
} from "@/redux/action/slice";
import { noop } from "lodash";
import selectedAddress from "@/redux/address/selector";
import { useAddress } from "@thirdweb-dev/react";
import ROUTES_PATH, { EXTERNAL_URL } from "@/constants/routesPath";
import ButtonWrapper from "@/components/ButtonWrapper";
import ModalStep from "@/components/ModalStep";
import Footer from "./Footer";
export const NftDetailContext = createContext({});

const {
  FAILED: buyFailed,
  SUCCESSFUL: buySuccessful,
  START: buyStart,
  CANCEL: buyCancel,
  PROCESSING: buyProcessing,
} = BUY_STEPS;
const {
  SUCCESSFUL: listForSaleSuccessful,
  PROCESSING: listForSaleProcessing,
  FAILED: listForSaleFailed,
  START: listForSaleStart,
} = LIST_FOR_SALE_STEPS;
const {
  START: removeFromSaleStart,
  FAILED: removeFromSaleFailed,
  SUCCESSFUL: removeFromSaleSuccessful,
  PROCESSING: removeFromSaleProccesing,
  CANCEL: removeFromSaleCancel,
} = REMOVE_FROM_SALE_STEPS;

const NFTDetail = () => {
  const intl = useIntl();
  const router = useRouter();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const account = useAddress();
  const { id } = useParams();
  const nftId = Array.isArray(id) ? id[0] : id;
  const [isRefreshSaleOrder, setIsRefreshSaleOrder] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<any>({});
  const { loading, data } = useGetNftDetail(nftId);
  const { data: listOwned, loading: loadingOwned } = useGetOwned(nftId);

  const { buyStep, listForSaleStep, removeFromSaleStep, transactionHash } =
    useAppSelector(selectedAction.getAction);
  const { address } = useAppSelector(selectedAddress.getAddress);

  const visibleBuyModal = buyStep !== buyStart;
  const isProcessingBuy = buyProcessing === buyStep;
  const isSuccessBuy = buySuccessful === buyStep;
  const isFailedBuy = [buyCancel, buyFailed].includes(buyStep as number);
  const isCompletedBuy = [buyFailed, buySuccessful].includes(buyStep as number);
  const nftType = data?.token.standard;
  const renderMintSuccessText = useMemo(
    () => (
      <Fragment>
        <p
          dangerouslySetInnerHTML={{
            __html: intl.formatMessage(
              { id: "NFT.detail.buy.susscess" },
              { name: data?.name }
            ),
          }}
        />
        <div className={style.buy_successful}>
          <a href={ROUTES_PATH.MY_ACCOUNT} target="_blank" rel="noreferrer">
            <ButtonWrapper
              className={style.buy_successful_button_view_nft}
              text={intl.formatMessage({ id: "NFT.detail.view.my.nfts" })}
              variant="primary"
            />
          </a>
          <a
            href={`${EXTERNAL_URL.POLYGON_SCAN}/${transactionHash}`}
            target="_blank"
            rel="noreferrer"
          >
            <ButtonWrapper
              className={style.buy_successful_button_view_ploygon}
              text={intl.formatMessage({ id: "NFT.detail.view.ploygon" })}
              variant="secondary"
            />
          </a>
        </div>
      </Fragment>
    ),
    [transactionHash, name, isCompletedBuy]
  );

  const handleCloseBuy = () => dispatch(handleSetBuyStep(buyStart));

  // list for sale attributes
  const visibleListForSaleModal = listForSaleStep !== listForSaleStart;
  const isProcessingListForSale = listForSaleStep === listForSaleProcessing;
  const isCompletedListForSale = listForSaleStep === listForSaleSuccessful;
  const isFailedListForSale = listForSaleStep === listForSaleFailed;
  const handleCloseListForSale = () =>
    dispatch(handleSetListForSaleStep(listForSaleStart));

  // remove from sale attributes
  const visibleRemoveFromSale = removeFromSaleStart !== removeFromSaleStep;
  const isFailedRemoveFromSale = [
    removeFromSaleFailed,
    removeFromSaleCancel,
  ].includes(removeFromSaleStep as number);

  const isSuccessfulRemoveFromSale =
    removeFromSaleSuccessful === removeFromSaleStep;
  const isProcessingRemoveFromSale =
    removeFromSaleProccesing === removeFromSaleStep;
  const isCompletedRemoveFromSale = [
    removeFromSaleFailed,
    removeFromSaleSuccessful,
  ].includes(removeFromSaleStep as number);

  const handleCloseListRemoveFromSale = () =>
    dispatch(handleSetRemoveFromSaleStep(removeFromSaleStart));

  const failedModal =
    isFailedBuy || isFailedListForSale || isFailedRemoveFromSale;
  const visibleModal =
    visibleListForSaleModal || visibleBuyModal || visibleRemoveFromSale;
  const successfulModal =
    isSuccessBuy || isCompletedListForSale || isSuccessfulRemoveFromSale;
  const processingModal =
    isProcessingBuy || isProcessingListForSale || isProcessingRemoveFromSale;
  const isEnableCloseableModal =
    isFailedBuy ||
    isSuccessBuy ||
    isCompletedListForSale ||
    isFailedListForSale ||
    isSuccessfulRemoveFromSale;

  const renderSuccessDescriptionModal = () => {
    switch (true) {
      case isSuccessBuy:
        return renderMintSuccessText;
      case isCompletedListForSale:
        return (
          <p
            dangerouslySetInnerHTML={{
              __html: intl.formatMessage(
                { id: "NFT.detail.listed.susscess" },
                { name: data?.name }
              ),
            }}
          />
        );
      case isSuccessfulRemoveFromSale:
        return (
          <p
            dangerouslySetInnerHTML={{
              __html: intl.formatMessage(
                { id: "NFT.detail.removed.susscess" },
                { name: data?.name }
              ),
            }}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (
      id ||
      isCompletedBuy ||
      isCompletedListForSale ||
      isCompletedRemoveFromSale
    ) {
      queryClient.refetchQueries({
        queryKey: ["getNftDetail"],
        type: "active",
      });
    }
  }, [id, isCompletedBuy, isCompletedListForSale, isCompletedRemoveFromSale]);

  useEffect(() => {
    if ((address && account && data?._id) || isCompletedBuy) {
      queryClient.refetchQueries({
        queryKey: ["getOwned"],
        type: "active",
      });
    }
  }, [data?._id, address, account, isCompletedBuy]);

  const handleCloseModal = () => {
    switch (true) {
      case isFailedBuy || isSuccessBuy:
        return handleCloseBuy();
      case isCompletedListForSale || isFailedListForSale:
        return handleCloseListForSale();
      case isCompletedRemoveFromSale || isFailedRemoveFromSale:
        return handleCloseListRemoveFromSale();
      default:
        return noop;
    }
  };

  return (
    <NftDetailContext.Provider
      value={{
        isCompletedBuy,
        isCompletedListForSale,
        isCompletedRemoveFromSale,

        isRefreshSaleOrder,
        onSetIsRefreshSaleOrder: setIsRefreshSaleOrder,

        selectedNFT,
        onSetSelectedNFT: setSelectedNFT,
      }}
    >
      <div className={classNames(style.nft_detail)}>
        <Header />
        <div className="container">
          <General />
          <Footer />
        </div>
      </div>
      <ModalStep
        visible={visibleModal}
        failed={failedModal}
        successful={successfulModal}
        processing={processingModal}
        showCloseIcon={isEnableCloseableModal}
        maskClosable={isEnableCloseableModal}
        successfulDescription={renderSuccessDescriptionModal()}
        innerHtml
        onFailedClose={handleCloseModal}
        onSuccessfulClose={handleCloseModal}
      />
    </NftDetailContext.Provider>
  );
};

export default NFTDetail;
