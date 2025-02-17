import { NFT_TRANSACTION_TYPE, REMOVE_FROM_SALE_STEPS } from "@/constants/nft";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useGetConfig } from "@/hooks/hook-customs/useGetConfig";
import selectedAction from "@/redux/action/selector";
import selectedAddress from "@/redux/address/selector";
import React, { Fragment, ReactNode, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useCreateTransaction, useUpdateTransaction } from "./hooks";
import {
  handleSetRemoveFromSaleStep,
  handleSetTransactionId,
} from "@/redux/action/slice";
import { handleSetConnectModal } from "@/redux/connection/slice";
import { useSocket } from "@/hooks/hook-customs/useSocket";
import { SOCKET_EVENT } from "@/constants";
import MetamaskService from "@/services/blockchain";
import { useSigner } from "@thirdweb-dev/react";
import ButtonWrapper from "../ButtonWrapper";
import RemoveFromSaleModal from "./RemoveFromSaleModal";

type RemoveFromSaleButtonProps = {
  nft?: any;
  visibleButton?: boolean;
  callback?: any;
  children?: ReactNode;
  onSetSelectedNFT?: any;
  selectedNFT?: any;
};

const { PROCESSING, SUCCESSFUL, FAILED, START, CANCEL } =
  REMOVE_FROM_SALE_STEPS;

const RemoveFromSaleButton = ({
  nft = {},
  visibleButton,
  callback,
  children,
  selectedNFT,
  onSetSelectedNFT,
  ...props
}: RemoveFromSaleButtonProps) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const { address } = useAppSelector(selectedAddress.getAddress);
  const signer = useSigner();

  const { removeFromSaleStep, transactionId } = useAppSelector<any>(
    selectedAction.getAction
  );

  const { loading: loadingCreateTransaction, onCreateTransaction } =
    useCreateTransaction();
  const { loading: loadingUpdateTransaction, onUpdateTransaction } =
    useUpdateTransaction();

  const [visible, setVisible] = useState(false);
  const [isCompletedRemoveFromSale, setIsCompletedRemoveFromSale] =
    useState(false);

  const handleUpdateRemoveFromSaleStep = (value: number) =>
    dispatch(handleSetRemoveFromSaleStep(value));

  const handleRemoveFromSaleServerError = () =>
    handleUpdateRemoveFromSaleStep(CANCEL);

  const handleRemoveFromSaleContractError = () =>
    handleUpdateRemoveFromSaleStep(FAILED);

  const handleToogleListForSaleModal = () => setVisible(!visible);

  useEffect(() => {
    if (START === removeFromSaleStep) {
      setIsCompletedRemoveFromSale(false);
    }
  }, [removeFromSaleStep]);

  const handleCheckListForSale = (nft: any) => () => {
    if (!address) {
      dispatch(handleSetConnectModal(true));
    } else {
      handleToogleListForSaleModal();
      onSetSelectedNFT && onSetSelectedNFT(nft);
    }
  };

  const handleRemoveFromSaleSuccess = () => {
    if (!isCompletedRemoveFromSale) {
      setIsCompletedRemoveFromSale(true);
      handleUpdateRemoveFromSaleStep(SUCCESSFUL);
      callback && callback();
    }
  };

  const handleCompletedRemoveFromSale = (
    transactionId: string,
    data: { hash: string; status: string }
  ) => {
    onUpdateTransaction({
      id: transactionId,
      data: data,
      onSuccess: handleRemoveFromSaleSuccess,
      onError: handleRemoveFromSaleServerError,
    });
  };

  const handleRemoveFromSaleEvent = (data: any) => {
    if (!isCompletedRemoveFromSale && data?.transactionId === transactionId) {
      handleRemoveFromSaleSuccess();
    }
  };

  useSocket({
    event: SOCKET_EVENT.BUY_NFT,
    handleEvent: handleRemoveFromSaleEvent,
    dependences: [transactionId, isCompletedRemoveFromSale],
  });

  const handleFailedContractRemoveFromSale = (
    transactionId: string,
    data: any
  ) => {
    onUpdateTransaction({
      id: transactionId,
      data: data,
      onSuccess: handleRemoveFromSaleContractError,
      onError: handleRemoveFromSaleContractError,
    });
  };

  const handleCancelApproveMemask = () => {
    handleUpdateRemoveFromSaleStep(START);
    setVisible(true);
  };

  const handleTransactionSuccessfulCreation = async (
    transactionId: string,
    data?: any
  ) => {
    dispatch(handleSetTransactionId(transactionId));
    const wallet = new MetamaskService().getInstance();

    await wallet.cancelSellOrder({
      signer,
      data,
      onCallback: (data: any) =>
        handleCompletedRemoveFromSale(transactionId, data),
      onCancelMetamask: handleCancelApproveMemask,
      onServerError: handleRemoveFromSaleServerError,
      onContractError: (data: any) =>
        handleFailedContractRemoveFromSale(transactionId, data),
    });
  };

  const handleListForSaleNFT = async () => {
    handleUpdateRemoveFromSaleStep(PROCESSING);
    setVisible(false);

    onCreateTransaction({
      data: {
        type: NFT_TRANSACTION_TYPE.DELISTED,
        transactionId: selectedNFT?.transactionId,
      },
      onSuccess: (id: string, data: any) =>
        handleTransactionSuccessfulCreation(id, data),
      onError: handleRemoveFromSaleServerError,
    });
  };

  return (
    <Fragment>
      {visibleButton && (
        <div onClick={handleCheckListForSale(nft)} className="cursor-pointer">
          {children || (
            <ButtonWrapper
              text={intl.formatMessage({
                id: "NFT.detail.owned.remove.from.sale",
              })}
            />
          )}
        </div>
      )}

      <RemoveFromSaleModal
        visible={visible}
        onClose={handleToogleListForSaleModal}
        nft={selectedNFT}
        onSubmit={handleListForSaleNFT}
        {...props}
      />
    </Fragment>
  );
};

export default RemoveFromSaleButton;
