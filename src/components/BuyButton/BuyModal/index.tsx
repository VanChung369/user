import { BUY_FIELD, BUY_STEPS, NFT_STANDARD } from "@/constants/nft";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useGetConfig } from "@/hooks/hook-customs/useGetConfig";
import selectedAddress from "@/redux/address/selector";
import { useQueryClient } from "@tanstack/react-query";
import { useSigner } from "@thirdweb-dev/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";
import BigNumber from "bignumber.js";
import MetamaskService from "@/services/blockchain";
import formatMessage from "@/components/FormatMessage";
import {
  convertPriceBigNumber,
  limitMaxlengNumber,
  multipleTwoBigNumber,
} from "@/utils/utils";
import ModalWrapper from "@/components/ModalWrapper";
import { Form, Formik } from "formik";
import { getBuySchema } from "../schema";
import { Col, Row } from "antd";
import Image from "next/image";
import EllipsisText from "@/components/EllipsisText";
import {
  DOLLAR_TEXT,
  EMPTY_DEFAULT_TEXT,
  MAX_LENGTH_TOTAL_SUPPLY,
  TYPE_INPUT,
  ZERO_VALUE,
} from "@/constants/input";
import classNames from "classnames";
import FormWrapper from "@/components/FormWrapper";
import ButtonWrapper from "@/components/ButtonWrapper";
import NumberFormatWrapper from "@/components/NumberFormatWrapper";
import style from "./index.module.scss";

const { QUANTITY } = BUY_FIELD;
const { START, FAILED, PROCESSING } = BUY_STEPS;

const initFormValues = {
  [QUANTITY]: "",
};

type BuyModalProps = {
  visible: boolean;
  onClose?: () => void;
  title?: string;
  onSubmit: (values?: any) => void;
  nft?: any;
  onSetStepBuy?: any;
  onSetVisible?: any;
  isEnoughBalance?: boolean;
  usd?: number;
  checkBalanceLoading?: boolean;
};

const BuyModal = ({
  visible,
  onClose,
  title,
  onSubmit,
  nft = {},
  onSetStepBuy,
  onSetVisible,
  isEnoughBalance,
  usd = 0,
  checkBalanceLoading,
  ...props
}: BuyModalProps) => {
  const intl = useIntl();
  const signer = useSigner();
  const formikRef = useRef(null) as any;
  const { currency, userMintingQuantityMax } = useGetConfig();
  const { address } = useAppSelector(selectedAddress.getAddress);
  const [loading, setLoading] = useState(false);
  const [allowanceERC20, setAllowanceERC20] = useState(new BigNumber(0));
  const [isShowApproveCurrency, setIsShowApproveCurrency] = useState(true);
  const [approveCurrencyLoading, setApproveCurrencyLoading] = useState(false);
  const wallet = new MetamaskService().getInstance();
  const { image, name, saleOrder = {}, maxQuantity = 0 } = nft;
  const { unitPrice, tokenId, quantity } = saleOrder;
  const is721Standard = NFT_STANDARD[0].value === nft?.token?.standard;

  const limitMinted = useMemo(() => {
    switch (true) {
      case is721Standard && maxQuantity > userMintingQuantityMax:
        return userMintingQuantityMax;
      default:
        return maxQuantity;
    }
  }, [is721Standard, maxQuantity, userMintingQuantityMax]);

  const renderTitle =
    title || intl.formatMessage({ id: "NFT.detail.checkout" });

  const getAllowanceERC20 = async (account: any) => {
    setApproveCurrencyLoading(true);
    try {
      const response = await wallet.getAllowanceERC20({
        account,
      });
      setAllowanceERC20(response as any);
    } catch (error) {
    } finally {
      setApproveCurrencyLoading(false);
    }
  };

  useEffect(() => {
    setIsShowApproveCurrency(true);
  }, [address]);

  useEffect(() => {
    if (address) {
      getAllowanceERC20(address);
    }
  }, [address]);

  const handleSetMaxQuantity = (setFieldValue: any, field: string) => () =>
    setFieldValue(field, limitMinted);

  const handleApproveCurrencySuccess = () => {
    setIsShowApproveCurrency(false);
    formatMessage({
      msgContent: intl.formatMessage({ id: "codeMessage.S1" }),
      type: "success",
    });
    onSetStepBuy(START);
    onSetVisible(true);
  };

  const handleApproveCurrencyFailed = () => {
    onSetStepBuy(FAILED);
    setIsShowApproveCurrency(true);
  };

  const handleCancleApproveMemask = () => {
    onSetStepBuy(START);
    onSetVisible(true);
  };

  const handleApproveCurrency = async () => {
    setLoading(true);
    onSetStepBuy(PROCESSING);
    onSetVisible(false);

    try {
      await wallet.setAllowanceERC20({
        signer,
        onSuccess: handleApproveCurrencySuccess,
        onError: handleApproveCurrencyFailed,
        onCancelMetamask: handleCancleApproveMemask,
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const isNeedApproveCurrency = useMemo(() => {
    const value = convertPriceBigNumber(unitPrice * quantity);
    return value.gt(allowanceERC20);
  }, [allowanceERC20, unitPrice, quantity]);

  const isDisableProcessButton = isShowApproveCurrency && isNeedApproveCurrency;

  return (
    <ModalWrapper
      open={visible}
      width={911}
      onClose={onClose}
      {...props}
      className={style.buy_modal}
      centered={true}
    >
      <div>
        <div className={style.buy_modal_title}>{renderTitle}</div>
        <Formik
          onSubmit={onSubmit}
          initialValues={initFormValues}
          validationSchema={getBuySchema(intl, limitMinted)}
          innerRef={formikRef}
        >
          {({ setFieldValue, values }: any) => {
            const subTotalPrice =
              values?.[QUANTITY] &&
              multipleTwoBigNumber(unitPrice, values?.[QUANTITY]);
            const subTotalUsd =
              values?.[QUANTITY] &&
              multipleTwoBigNumber(unitPrice * usd, values?.[QUANTITY]);

            return (
              <Row>
                <Col md={12} xs={24} className={style.buy_modal_preview}>
                  <Image
                    src={image?.url}
                    alt={name}
                    fill
                    sizes="(max-width: 600px) 100vw, 50vw"
                  />
                </Col>
                <Col md={12} xs={24} className={style.buy_modal_form}>
                  <Form>
                    <EllipsisText
                      text={name}
                      className={style.buy_modal_form_name}
                    />
                    {tokenId && (
                      <p className={style.buy_modal_form_token}>
                        {intl.formatMessage({ id: "NFT.detail.token.id" })}:{" "}
                        {tokenId}
                      </p>
                    )}

                    <FormWrapper
                      containerClassName={style.buy_modal_form_input}
                      typeInput={TYPE_INPUT.NUMBER}
                      placeholder={intl.formatMessage({
                        id: "NFT.detail.input.quantity",
                      })}
                      decimalScale={ZERO_VALUE}
                      thousandSeparator
                      name={QUANTITY}
                      label={intl.formatMessage({ id: "NFT.detail.quantity" })}
                      appendInput={
                        <ButtonWrapper
                          text={intl.formatMessage({ id: "NFT.detail.max" })}
                          className={style.buy_modal_form_input_button_max}
                          onClick={handleSetMaxQuantity(
                            setFieldValue,
                            QUANTITY
                          )}
                          variant="primary"
                        />
                      }
                      isAllowed={limitMaxlengNumber(MAX_LENGTH_TOTAL_SUPPLY)}
                    />

                    <div className={style.buy_modal_form_item}>
                      <span className={style.buy_modal_form_item_label}>
                        {intl.formatMessage({ id: "NFT.detail.pirce" })}
                      </span>
                      <div className={style.buy_modal_form_item_currency}>
                        <div className={style.buy_modal_form_item_currency_top}>
                          <Image
                            src={currency?.icon}
                            alt={"currency icon"}
                            width={25}
                            height={25}
                          />
                          {unitPrice ? (
                            <NumberFormatWrapper value={unitPrice} />
                          ) : (
                            EMPTY_DEFAULT_TEXT
                          )}
                          <span
                            className={
                              style.buy_modal_form_item_currency_symbol
                            }
                          >
                            {currency?.symbol}
                          </span>
                        </div>
                        <div
                          className={style.buy_modal_form_item_currency_price}
                        >
                          ~&nbsp;
                          {DOLLAR_TEXT}&nbsp;
                          {unitPrice ? (
                            <NumberFormatWrapper
                              value={unitPrice * usd}
                              decimalScale={8}
                            />
                          ) : (
                            EMPTY_DEFAULT_TEXT
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={style.buy_modal_form_item}>
                      <span className={style.buy_modal_form_item_label}>
                        {intl.formatMessage({ id: "NFT.detail.subtotal" })}
                      </span>
                      <div className={style.buy_modal_form_item_currency}>
                        <div className={style.buy_modal_form_item_currency_top}>
                          <Image
                            src={currency?.icon}
                            alt={"currency icon"}
                            width={25}
                            height={25}
                          />
                          {subTotalPrice ? (
                            <NumberFormatWrapper value={subTotalPrice} />
                          ) : (
                            EMPTY_DEFAULT_TEXT
                          )}

                          <span
                            className={
                              style.buy_modal_form_item_currency_symbol
                            }
                          >
                            {currency.symbol}
                          </span>
                        </div>
                        <div
                          className={style.buy_modal_form_item_currency_price}
                        >
                          ~&nbsp;{DOLLAR_TEXT}&nbsp;
                          {subTotalUsd ? (
                            <NumberFormatWrapper
                              value={subTotalUsd}
                              decimalScale={8}
                            />
                          ) : (
                            EMPTY_DEFAULT_TEXT
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={style.buy_modal_button}>
                      {isShowApproveCurrency && isNeedApproveCurrency && (
                        <ButtonWrapper
                          className={style.buy_modal_button_approve}
                          text={intl.formatMessage({
                            id: "NFT.detail.approve.currency",
                          })}
                          variant="primary"
                          onClick={handleApproveCurrency}
                          disabled={loading}
                          loading={approveCurrencyLoading}
                        />
                      )}
                      <ButtonWrapper
                        htmlType="submit"
                        className={style.buy_modal_button_proceed}
                        text={intl.formatMessage({
                          id: "NFT.detail.proceed.payment",
                        })}
                        variant="primary"
                        loading={checkBalanceLoading}
                        disabled={
                          isDisableProcessButton ||
                          loading ||
                          checkBalanceLoading ||
                          approveCurrencyLoading
                        }
                      />
                      {!isEnoughBalance && (
                        <div className={style.buy_modal_message_error}>
                          {intl.formatMessage({ id: "codeMessage.E6" })}
                        </div>
                      )}
                    </div>
                  </Form>
                </Col>
              </Row>
            );
          }}
        </Formik>
      </div>
    </ModalWrapper>
  );
};
export default BuyModal;
