import { MIN_VALUE_TOTAL_COPIES } from "@/constants/input";
import { LIST_FOR_SALE_FIELD, LIST_FOR_SALE_STEPS } from "@/constants/nft";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useGetConfig } from "@/hooks/hook-customs/useGetConfig";
import { handleSetListForSaleStep } from "@/redux/action/slice";
import selectedAddress from "@/redux/address/selector";
import { handleSetConnectModal } from "@/redux/connection/slice";
import MetamaskService from "@/services/blockchain";
import { convertToNumber } from "@/utils/utils";
import { isEmpty } from "lodash";
import React, { Fragment, ReactNode, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import ButtonWrapper from "../ButtonWrapper";
import { useListForSaleNFT } from "./hooks";
import ListForSaleModal from "./ListForSaleModal";
import style from "./index.module.scss";

type ListForSaleButtonProps = {
  nft?: any;
  visibleButton?: boolean;
  callback?: any;
  children?: ReactNode;
  onSetSelectedNFT?: any;
  selectedNFT?: any;
};

const { PROCESSING, SUCCESSFUL, FAILED } = LIST_FOR_SALE_STEPS;
const { QUANTITY, UNIT_PRICE, TOKEN_ID, CURRENCY } = LIST_FOR_SALE_FIELD;

const ListForSaleButton = ({
  nft = {},
  visibleButton,
  callback,
  children,
  selectedNFT,
  onSetSelectedNFT,
  ...props
}: ListForSaleButtonProps) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const { currency } = useGetConfig();
  const { address } = useAppSelector(selectedAddress.getAddress);
  const { loading, onListForSaleNFT } = useListForSaleNFT();
  const [visible, setVisible] = useState(false);
  const [isApprovedListForSale, setIsApproveListForSale] = useState(false);
  const [loadingApprovedListForSale, setLoadingApprovedListForSale] =
    useState(false);

  const wallet = new MetamaskService().getInstance();

  const handleUpdateListForSaleStep = (value: number) =>
    dispatch(handleSetListForSaleStep(value));

  const handleListForSaleError = () => handleUpdateListForSaleStep(FAILED);

  const handleToggleListForSaleModal = () => setVisible(!visible);

  const handleIsCheckListForSaleApproved = async () => {
    setLoadingApprovedListForSale(true);
    try {
      const { token } = selectedNFT;
      const response = await wallet.checkListForSaleNftApproved({
        account: address,
        standard: token?.standard,
      });
      setIsApproveListForSale(response);
    } catch (error) {
    } finally {
      setLoadingApprovedListForSale(false);
    }
  };

  useEffect(() => {
    if (visibleButton && !isEmpty(selectedNFT) && address) {
      handleIsCheckListForSaleApproved();
    }
  }, [selectedNFT, visibleButton, address]);

  const handleCheckListForSale = (nft: any) => () => {
    if (!address) {
      dispatch(handleSetConnectModal(true));
    } else {
      handleToggleListForSaleModal();
      onSetSelectedNFT && onSetSelectedNFT(nft);
    }
  };

  const handleListForSaleSuccess = () => {
    handleUpdateListForSaleStep(SUCCESSFUL);
    callback && callback();
  };

  const handleGetFieldParam = (value: number) =>
    value || MIN_VALUE_TOTAL_COPIES;

  const handleListForSaleNFT = (values: any) => {
    handleUpdateListForSaleStep(PROCESSING);
    setVisible(false);

    if (selectedNFT?.tokenId) {
      onListForSaleNFT({
        id: selectedNFT?._id,
        data: {
          [QUANTITY]: handleGetFieldParam(convertToNumber(values?.[QUANTITY])),
          [UNIT_PRICE]: handleGetFieldParam(values?.[UNIT_PRICE]),
          [TOKEN_ID]: selectedNFT?.tokenId,
          [CURRENCY]: currency?.name,
        },
        onSuccess: handleListForSaleSuccess,
        onError: handleListForSaleError,
      });
    }
  };

  return (
    <Fragment>
      {visibleButton && (
        <div onClick={handleCheckListForSale(nft)} className="cursor-pointer">
          {children || (
            <ButtonWrapper
              className={style.list_for_sale_button_sale}
              text={intl.formatMessage({
                id: "NFT.detail.owned.list.for.sale",
              })}
              variant="secondary"
            />
          )}
        </div>
      )}

      <ListForSaleModal
        visible={visible}
        nft={selectedNFT}
        isDisableProcessButton={!isApprovedListForSale}
        onSetVisible={setVisible}
        onSubmit={handleListForSaleNFT}
        onClose={handleToggleListForSaleModal}
        onSetStepListForSale={handleUpdateListForSaleStep}
        setIsApproveListForSale={setIsApproveListForSale}
        loadingApprovedListForSale={loadingApprovedListForSale}
        {...props}
      />
    </Fragment>
  );
};

export default ListForSaleButton;
