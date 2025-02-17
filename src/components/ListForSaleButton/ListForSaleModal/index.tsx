import React, { useMemo, useState } from "react";
import { Form, Formik } from "formik";
import { Col, Row } from "antd";
import classNames from "classnames";
import {
  LIST_FOR_SALE_FIELD,
  LIST_FOR_SALE_STEPS,
  NFT_STANDARD,
} from "@/constants/nft";
import { useIntl } from "react-intl";
import { useGetConfig } from "@/hooks/hook-customs/useGetConfig";
import { useAppSelector } from "@/hooks";
import selectedAddress from "@/redux/address/selector";
import MetamaskService from "@/services/blockchain";
import formatMessage from "@/components/FormatMessage";
import { useSigner } from "@thirdweb-dev/react";
import ItemWithLabel from "@/components/ItemWithLabel";
import {
  DOLLAR_TEXT,
  EMPTY_DEFAULT_TEXT,
  MAX_LENGTH_TOTAL_SUPPLY,
  MIN_VALUE_TOTAL_COPIES,
  NFT_DECIMAL_SCALE_PRICE,
  NFT_PERCENTAGE_SUFFIX,
  PERCENTAGE_NUMBER,
  TYPE_INPUT,
  ZERO_VALUE,
} from "@/constants/input";
import EllipsisText from "@/components/EllipsisText";
import { getListForSaleSchema } from "../schema";
import FormWrapper from "@/components/FormWrapper";
import ButtonWrapper from "@/components/ButtonWrapper";
import { limitMaxlengNumber } from "@/utils/utils";
import NumberFormatWrapper from "@/components/NumberFormatWrapper";
import ModalWrapper from "@/components/ModalWrapper";
import style from "./index.module.scss";
import Image from "next/image";

const { START, PROCESSING, CANCEL } = LIST_FOR_SALE_STEPS;
const { QUANTITY, UNIT_PRICE } = LIST_FOR_SALE_FIELD;

type ListForSaleModalProps = {
  visible: boolean;
  onClose?: () => void;
  onSubmit?: any;
  nft?: any;
  title?: string;
  isDisableProcessButton?: boolean;
  onSetVisible?: any;
  setIsApproveListForSale?: any;
  onSetStepListForSale?: any;
  loadingApprovedListForSale?: boolean;
};

const ListForSaleModal = ({
  visible,
  onClose,
  onSubmit,
  title,
  nft,
  isDisableProcessButton,
  onSetVisible,
  setIsApproveListForSale,
  onSetStepListForSale,
  loadingApprovedListForSale,
  ...props
}: ListForSaleModalProps) => {
  const intl = useIntl();
  const { currency } = useGetConfig();
  const { address } = useAppSelector(selectedAddress.getAddress);
  const [loading, setLoading] = useState(false);
  const wallet = new MetamaskService().getInstance();
  const signer = useSigner();

  const renderTitle =
    title || intl.formatMessage({ id: "NFT.detail.owned.list.for.sale" });
  const is721Standard = NFT_STANDARD[0].value === nft?.token?.standard;

  const handleApproveNFTSuccess = () => {
    formatMessage({
      msgContent: intl.formatMessage({ id: "codeMessage.S9" }),
      type: "success",
    });
    setIsApproveListForSale(true);
    onSetStepListForSale(START);
    onSetVisible(true);
  };

  const handleApproveNFTFailed = () => {
    onSetStepListForSale(CANCEL);
    setIsApproveListForSale(false);
  };

  const handleCancelApproveMetamask = () => {
    onSetStepListForSale(START);
    onSetVisible(true);
  };

  const handleApproveNFT = async () => {
    setLoading(true);
    onSetVisible(false);
    onSetStepListForSale(PROCESSING);

    try {
      await wallet.setListForSaleNftApproved({
        signer,
        approved: true,
        standard: nft?.token?.standard,
        onSuccess: handleApproveNFTSuccess,
        onError: handleApproveNFTFailed,
        onCancelMetamask: handleCancelApproveMetamask,
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const renderErc721TotalCopies = useMemo(
    () => (
      <ItemWithLabel
        label={intl.formatMessage({ id: "NFT.detail.owned.quantity" })}
        labelClassName={style.list_for_sale_modal_form_item_lable}
      >
        <span className={style.list_for_sale_modal_form_item_text}>
          {MIN_VALUE_TOTAL_COPIES}
        </span>
      </ItemWithLabel>
    ),
    [is721Standard]
  );

  const handleSetMaxQuantity = (setFieldValue: any, field: string) => () =>
    setFieldValue(field, nft?.quantity);

  return (
    <ModalWrapper
      centered={true}
      open={visible}
      width={911}
      onClose={onClose}
      {...props}
    >
      <div className={style.list_for_sale_modal}>
        <div className={style.list_for_sale_modal_title}>{renderTitle}</div>
        <Formik
          onSubmit={onSubmit}
          initialValues={{
            [QUANTITY]: "",
            [UNIT_PRICE]: "",
          }}
          validationSchema={getListForSaleSchema(intl, nft?.quantity, {
            requiredQuantity: is721Standard,
          })}
        >
          {({ setFieldValue, values, errors }) => {
            const unitPrice = values?.[UNIT_PRICE] as any;
            const quantity = is721Standard
              ? MIN_VALUE_TOTAL_COPIES
              : (values?.[QUANTITY] as any);

            return (
              <Row>
                <Col
                  md={12}
                  xs={24}
                  className={style.list_for_sale_modal_preview}
                >
                  <Image
                    src={nft?.image?.url}
                    alt={nft?.name}
                    fill
                    sizes="(max-width: 600px) 100vw, 50vw"
                  />
                </Col>
                <Col md={12} xs={24} className={style.list_for_sale_modal_form}>
                  <Form>
                    <EllipsisText
                      text={nft?.name}
                      className={style.list_for_sale_modal_form_name}
                    />
                    <p className={style.list_for_sale_modal_form_name_token}>
                      {intl.formatMessage({ id: "NFT.detail.owned.token.id" })}:{" "}
                      {nft?.tokenId}
                    </p>

                    {is721Standard ? (
                      renderErc721TotalCopies
                    ) : (
                      <FormWrapper
                        containerClassName={
                          style.list_for_sale_modal_form_input
                        }
                        typeInput={TYPE_INPUT.NUMBER}
                        placeholder={intl.formatMessage({
                          id: "NFT.detail.owned.quantity",
                        })}
                        decimalScale={ZERO_VALUE}
                        thousandSeparator
                        name={QUANTITY}
                        label={intl.formatMessage({
                          id: "NFT.detail.owned.quantity",
                        })}
                        appendInput={
                          <ButtonWrapper
                            text={intl.formatMessage({ id: "NFT.detail.max" })}
                            className={
                              style.list_for_sale_modal_form_input_button_max
                            }
                            onClick={handleSetMaxQuantity(
                              setFieldValue,
                              QUANTITY
                            )}
                            variant="primary"
                          />
                        }
                        isAllowed={limitMaxlengNumber(MAX_LENGTH_TOTAL_SUPPLY)}
                      />
                    )}

                    <FormWrapper
                      thousandSeparator
                      name={UNIT_PRICE}
                      typeInput={TYPE_INPUT.NUMBER}
                      decimalScale={NFT_DECIMAL_SCALE_PRICE}
                      containerClassName={style.list_for_sale_modal_form_input}
                      placeholder={intl.formatMessage({
                        id: "NFT.detail.owned.price",
                      })}
                      label={intl.formatMessage({
                        id: "NFT.detail.owned.price",
                      })}
                      appendInput={
                        <div
                          className={
                            style.list_for_sale_modal_form_input_currency
                          }
                        >
                          {currency?.symbol}
                        </div>
                      }
                      isAllowed={limitMaxlengNumber()}
                    />
                    <ItemWithLabel
                      label={intl.formatMessage({
                        id: "NFT.detail.royalties",
                      })}
                      labelClassName={style.list_for_sale_modal_form_item_lable}
                      helpText={intl.formatMessage({
                        id: "NFT.detail.royalties.tooltip",
                      })}
                    >
                      <span
                        className={style.list_for_sale_modal_form_item_text}
                      >
                        {nft?.royaltyFee}
                        {NFT_PERCENTAGE_SUFFIX}
                      </span>
                    </ItemWithLabel>

                    <ItemWithLabel
                      label={intl.formatMessage({
                        id: "NFT.detail.owned.profit.per.edition",
                      })}
                      labelClassName={style.list_for_sale_modal_form_item_lable}
                      helpText={intl.formatMessage({
                        id: "NFT.detail.owned.profit.per.edition.tooltip",
                      })}
                    >
                      <div className={style.column}>
                        <div className={style.label}>
                          <EllipsisText
                            text={
                              unitPrice && quantity ? (
                                <NumberFormatWrapper
                                  value={
                                    unitPrice *
                                    (1 - nft?.royaltyFee / PERCENTAGE_NUMBER)
                                  }
                                />
                              ) : (
                                EMPTY_DEFAULT_TEXT
                              )
                            }
                          />
                          &nbsp;
                          <span className={style.text}>{currency?.symbol}</span>
                        </div>
                        <div className={style.content}>
                          <EllipsisText
                            text={
                              unitPrice && quantity ? (
                                <NumberFormatWrapper
                                  value={
                                    unitPrice *
                                    quantity *
                                    (1 - nft?.royaltyFee / PERCENTAGE_NUMBER) *
                                    currency?.usd
                                  }
                                />
                              ) : (
                                EMPTY_DEFAULT_TEXT
                              )
                            }
                          />
                          &nbsp; ~&nbsp;{DOLLAR_TEXT}
                        </div>
                      </div>
                    </ItemWithLabel>

                    <div className={style.list_for_sale_modal_button}>
                      {isDisableProcessButton && (
                        <ButtonWrapper
                          className={style.list_for_sale_modal_button_approve}
                          text={intl.formatMessage({
                            id: "NFT.detail.owned.approve.nft",
                          })}
                          variant="primary"
                          onClick={handleApproveNFT}
                          disabled={loading}
                          loading={loadingApprovedListForSale}
                        />
                      )}
                      <ButtonWrapper
                        htmlType="submit"
                        className={style.list_for_sale_modal_button_proceed}
                        text={intl.formatMessage({
                          id: "NFT.detail.owned.process.listing",
                        })}
                        variant="primary"
                        disabled={
                          isDisableProcessButton ||
                          loading ||
                          loadingApprovedListForSale
                        }
                      />
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

export default ListForSaleModal;
