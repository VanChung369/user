import {
  BUY_FIELD,
  BUY_STEPS,
  NFT_SALE_ORDER_TYPE,
  NFT_TRANSACTION_TYPE,
} from "@/constants/nft";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useGetConfig } from "@/hooks/hook-customs/useGetConfig";
import selectedAction from "@/redux/action/selector";
import selectedAddress from "@/redux/address/selector";
import selectedConnection from "@/redux/connection/selector";
import { Fragment, ReactNode, useEffect, useState } from "react";
import {
  useCreateTransaction,
  useUpdateTransaction,
  useUpdateTransactionHash,
} from "./hooks";
import formatMessage from "../FormatMessage";
import { useIntl } from "react-intl";
import { handleSetConnectModal } from "@/redux/connection/slice";
import { useQueryClient } from "@tanstack/react-query";
import {
  handleSetBuyStep,
  handleSetTransactionHash,
  handleSetTransactionId,
} from "@/redux/action/slice";
import { SOCKET_EVENT } from "@/constants";
import { useSocket } from "@/hooks/hook-customs/useSocket";
import MetamaskService from "@/services/blockchain";
import { useSigner } from "@thirdweb-dev/react";
import { debounce } from "lodash";
import { MIN_VALUE_TOTAL_COPIES } from "@/constants/input";
import BuyModal from "./BuyModal";

const { MINTED, TRANSFER } = NFT_TRANSACTION_TYPE;
const { PROCESSING, SUCCESSFUL, FAILED, START, CANCEL } = BUY_STEPS;
const { QUANTITY, SALE_ORDER_ID, TYPE: TYPE_BUY_FIELD } = BUY_FIELD;

type BuyButtonProps = {
  children?: ReactNode;
  nft?: any;
  callback?: any;
  onSetSelectedNFT?: any;
  selectedNFT?: any;
  isRefreshNFT?: boolean;
  visibleButton?: boolean;
};

const BuyButton = ({
  children,
  nft = {},
  callback,
  selectedNFT,
  onSetSelectedNFT,
  isRefreshNFT,
  visibleButton,
}: BuyButtonProps) => {
  const intl = useIntl();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const signer = useSigner();
  const { currencies } = useGetConfig();
  const { address } = useAppSelector(selectedAddress.getAddress);
  const { buyStep, transactionId } = useAppSelector(selectedAction.getAction);
  const { isConnected } = useAppSelector(selectedConnection.getConnection);
  const wallet = new MetamaskService().getInstance();

  const { loading: loadingCreateTransaction, onCreateTransaction } =
    useCreateTransaction();
  const { loading: loadingUpdateTransaction, onUpdateTransaction } =
    useUpdateTransaction();
  const { onUpdateTransactionHash } = useUpdateTransactionHash();

  const [visible, setVisible] = useState(false);
  const [isCompletedBuy, setIsCompleteBuy] = useState(false);
  const [isEnoughBalance, setIsEnoughBalance] = useState(true);
  const [checkBalanceLoading, setCheckBalanceLoading] = useState(false);
  const [isClickBuyButton, setIsClickBuyButton] = useState(false);

  const { saleOrder = {}, token = {} } = nft;
  const { unitPrice, type, currency = {} } = saleOrder;
  const { address: tokenAddress } = token;

  const selectedCurrency = currencies?.find(
    (item: any) => item?.name === currency?.name
  );

  useEffect(() => {
    if (!visible) {
      setIsEnoughBalance(true);
    }
  }, [visible]);

  useEffect(() => {
    if (START === buyStep) {
      setIsCompleteBuy(false);
    }
  }, [buyStep]);

  useEffect(() => {
    if (isRefreshNFT && nft?._id) {
      if (!nft?.saleOrder && isClickBuyButton) {
        setVisible(false);
        formatMessage({
          msgContent: intl.formatMessage({ id: "codeMessage.E5" }),
          type: "error",
        });
        setIsClickBuyButton(false);
      } else {
        onSetSelectedNFT({
          ...nft,
          maxQuantity: nft?.saleOrder?.remain || nft?.remain,
        });
      }
    }
  }, [nft, isRefreshNFT]);

  const handleCheckBuyButton = (nft: any) => () => {
    if (!isConnected) {
      dispatch(handleSetConnectModal(true));
    } else {
      handleToogleBuyModal();
      setIsClickBuyButton(true);
      if (isRefreshNFT && saleOrder?.type === NFT_SALE_ORDER_TYPE.RESELL) {
        queryClient.refetchQueries({
          queryKey: ["getNftDetail"],
          type: "active",
        });
      } else {
        onSetSelectedNFT &&
          onSetSelectedNFT({
            ...nft,
            maxQuantity: nft?.saleOrder?.remain || nft?.remain,
          });
      }
    }
  };

  const handleUpdateBuyStep = (value: number) =>
    dispatch(handleSetBuyStep(value));

  const handleCloseBuyModal = () => handleUpdateBuyStep(START);

  const handleBuyServerError = () => handleUpdateBuyStep(CANCEL);

  const handleBuyContractError = () => handleUpdateBuyStep(FAILED);

  const handleToogleBuyModal = () => setVisible(!visible);

  const handleBuySuccess = () => {
    if (!isCompletedBuy) {
      setIsCompleteBuy(true);
      handleUpdateBuyStep(SUCCESSFUL);
      setIsClickBuyButton(false);
      callback && callback();
    }
  };

  const handleBuyEvent = (data: any) => {
    if (!isCompletedBuy && data?.transactionId === transactionId) {
      dispatch(handleSetTransactionHash(data?.hash));
      handleBuySuccess();
    }
  };

  useSocket({
    event: SOCKET_EVENT.BUY_NFT,
    handleEvent: handleBuyEvent,
    dependences: [transactionId, isCompletedBuy],
  });

  const handleCompleteContractBuyed = (transactionId: string, data: any) => {
    dispatch(handleSetTransactionHash(data?.hash));
    onUpdateTransaction({
      id: transactionId,
      data: data,
      onSuccess: handleBuySuccess,
      onError: handleBuyServerError,
    });
  };

  const handleFailedContractBuyed = (transactionId: string, data: any) => {
    onUpdateTransaction({
      id: transactionId,
      data: data,
      onSuccess: handleBuyContractError,
      onError: handleBuyContractError,
    });
  };

  const handleUpdateTransactionHash = (transactionId: string, hash: string) => {
    onUpdateTransactionHash({
      id: transactionId,
      data: { hash },
    });
  };

  const handleTransactionSuccessfulCreation = async (
    transactionId: string,
    data: any
  ) => {
    dispatch(handleSetTransactionId(transactionId));
    await wallet.buyNFT({
      signer: signer,
      data,
      isSecondary: type !== NFT_SALE_ORDER_TYPE.SELL,
      onUpdateTransactionHash: (hash: string) =>
        handleUpdateTransactionHash(transactionId, hash),
      onCallback: (data: any) =>
        handleCompleteContractBuyed(transactionId, data),
      onCancelMetamask: handleCloseBuyModal,
      onServerError: handleBuyServerError,
      onContractError: (data: any) =>
        handleFailedContractBuyed(transactionId, data),
    });
  };

  const handleProceedBuy = debounce(async (values: any) => {
    setCheckBalanceLoading(true);

    const isEnoughBalance = await wallet.checkBuyerBalance({
      signer: signer,
      address,
      tokenAddress,
      price: unitPrice,
      quantity: values?.quantity
        ? parseInt(values?.quantity)
        : MIN_VALUE_TOTAL_COPIES,
    });

    setCheckBalanceLoading(false);

    setIsEnoughBalance(isEnoughBalance);
    if (isEnoughBalance) {
      handleUpdateBuyStep(PROCESSING);
      handleToogleBuyModal();

      onCreateTransaction({
        data: {
          [TYPE_BUY_FIELD]:
            type === NFT_SALE_ORDER_TYPE.SELL ? MINTED : TRANSFER,
          [SALE_ORDER_ID]: saleOrder?._id,
          [QUANTITY]: values?.quantity
            ? parseInt(values?.quantity)
            : MIN_VALUE_TOTAL_COPIES,
        },
        onSuccess: (id: string, data: any) =>
          handleTransactionSuccessfulCreation(id, data),
        onError: handleBuyServerError,
      });
    }
  }, 500);

  return (
    <Fragment>
      {visibleButton && (
        <div onClick={handleCheckBuyButton(nft)} className="buy-button">
          {children}
        </div>
      )}

      <BuyModal
        nft={selectedNFT}
        visible={visible}
        usd={selectedCurrency?.usd}
        isEnoughBalance={isEnoughBalance}
        onSetVisible={setVisible}
        onSubmit={handleProceedBuy}
        onClose={handleToogleBuyModal}
        onSetStepBuy={handleUpdateBuyStep}
        checkBalanceLoading={checkBalanceLoading}
      />
    </Fragment>
  );
};
export default BuyButton;
