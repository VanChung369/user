import { Form, Formik } from "formik";
import { Col, Row } from "antd";
import Image from "next/image";
import classNames from "classnames";
import { useIntl } from "react-intl";
import { useGetConfig } from "@/hooks/hook-customs/useGetConfig";
import { LIST_FOR_SALE_FIELD } from "@/constants/nft";
import ModalWrapper from "@/components/ModalWrapper";
import EllipsisText from "@/components/EllipsisText";
import ItemWithLabel from "@/components/ItemWithLabel";
import { PERCENTAGE_NUMBER, TOKEN_SUPPORT } from "@/constants";
import { DOLLAR_TEXT, NFT_PERCENTAGE_SUFFIX } from "@/constants/input";
import NumberFormatWrapper from "@/components/NumberFormatWrapper";
import ButtonWrapper from "@/components/ButtonWrapper";
import style from "./index.module.scss";

const { QUANTITY, UNIT_PRICE } = LIST_FOR_SALE_FIELD;

type RemoveFromSaleModalProps = {
  visible: boolean;
  onClose?: () => void;
  onSubmit?: any;
  nft?: any;
  title?: string;
};

const RemoveFromSaleModal = ({
  visible,
  onClose,
  onSubmit,
  title,
  nft = {},
  ...props
}: RemoveFromSaleModalProps) => {
  const intl = useIntl();

  const { currencies } = useGetConfig();

  const {
    image,
    name,
    quantity,
    tokenId,
    royaltyFee,
    unitPrice,
    usd,
    currency,
    quantityForSale,
  } = nft;
  const selectedCurrency =
    currencies?.find((item: any) => item?.name === currency?.name) || {};
  const { symbol, usd: usdSelectedCurrency } = selectedCurrency;

  const renderTitle =
    title ||
    intl.formatMessage({
      id: "NFT.detail.owned.remove.from.sale",
    });

  return (
    <ModalWrapper
      open={visible}
      width={911}
      onClose={onClose}
      {...props}
      centered={true}
    >
      <div className={style.list_for_sale_modal}>
        <div className={style.list_for_sale_modal_title}>{renderTitle}</div>
        <Formik
          onSubmit={onSubmit}
          initialValues={{
            [QUANTITY]: "",
            [UNIT_PRICE]: "",
          }}
        >
          {() => {
            return (
              <Row>
                <Col
                  md={12}
                  xs={24}
                  className={style.list_for_sale_modal_preview}
                >
                  <Image
                    src={image?.url}
                    alt={name}
                    fill
                    sizes="(max-width: 600px) 100vw, 50vw"
                  />
                </Col>
                <Col md={12} xs={24} className={style.list_for_sale_modal_form}>
                  <Form>
                    <EllipsisText
                      text={name}
                      className={style.list_for_sale_modal_form_name}
                    />
                    <p className={style.list_for_sale_modal_form_name_token}>
                      {intl.formatMessage({
                        id: "NFT.detail.owned.token.id",
                      })}
                      : {tokenId}
                    </p>

                    <ItemWithLabel
                      label={intl.formatMessage({
                        id: "NFT.detail.owned.quantity",
                      })}
                      labelClassName={style.list_for_sale_modal_form_item_lable}
                    >
                      <NumberFormatWrapper
                        value={quantityForSale}
                        className={style.list_for_sale_modal_form_item_text}
                      />
                    </ItemWithLabel>

                    <ItemWithLabel
                      label={intl.formatMessage({
                        id: "NFT.detail.owned.price",
                      })}
                      labelClassName={style.list_for_sale_modal_form_item_lable}
                    >
                      <div className={style.column}>
                        <p className={style.label}>
                          <Image
                            src={TOKEN_SUPPORT.icon}
                            alt={"TOKEN SUPPORT"}
                            height={25}
                            width={25}
                          />
                          &nbsp;
                          <EllipsisText
                            className={style.list_for_sale_modal_form_item_text}
                            text={<NumberFormatWrapper value={unitPrice} />}
                          />
                          &nbsp;
                          <span
                            className={style.list_for_sale_modal_form_item_text}
                          >
                            {symbol}
                          </span>
                        </p>
                        <p className={style.content}>
                          ~&nbsp;{DOLLAR_TEXT}&nbsp;
                          <EllipsisText
                            text={<NumberFormatWrapper value={usd} />}
                          />
                          &nbsp;
                        </p>
                      </div>
                    </ItemWithLabel>

                    <ItemWithLabel
                      label={intl.formatMessage({
                        id: "NFT.detail.owned.royalties",
                      })}
                      labelClassName={style.list_for_sale_modal_form_item_lable}
                    >
                      <span
                        className={style.list_for_sale_modal_form_item_text}
                      >
                        {royaltyFee}
                        {NFT_PERCENTAGE_SUFFIX}
                      </span>
                    </ItemWithLabel>

                    <ItemWithLabel
                      label={intl.formatMessage({
                        id: "NFT.detail.owned.profit.per.edition",
                      })}
                      helpText={intl.formatMessage({
                        id: "NFT.detail.owned.profit.per.edition.tooltip",
                      })}
                      labelClassName={style.list_for_sale_modal_form_item_lable}
                    >
                      <div className={style.column}>
                        <p className={style.label}>
                          <Image
                            src={TOKEN_SUPPORT.icon}
                            alt={"TOKEN SUPPORT"}
                            height={25}
                            width={25}
                          />
                          &nbsp;
                          <EllipsisText
                            text={
                              <NumberFormatWrapper
                                value={
                                  unitPrice *
                                  (1 - royaltyFee / PERCENTAGE_NUMBER)
                                }
                              />
                            }
                          />
                          &nbsp;
                          <span className={style.text}>{symbol}</span>
                        </p>
                        <p className={style.content}>
                          ~&nbsp;{DOLLAR_TEXT}&nbsp;
                          <EllipsisText
                            text={
                              <NumberFormatWrapper
                                value={
                                  unitPrice *
                                  quantity *
                                  (1 - royaltyFee / PERCENTAGE_NUMBER) *
                                  usdSelectedCurrency
                                }
                              />
                            }
                          />
                          &nbsp;
                        </p>
                      </div>
                    </ItemWithLabel>

                    <div className={style.list_for_sale_modal_button}>
                      <ButtonWrapper
                        htmlType="submit"
                        className={style.list_for_sale_modal_button_approve}
                        text={intl.formatMessage({
                          id: "NFT.detail.owned.proceed.removal",
                        })}
                        variant="primary"
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

export default RemoveFromSaleModal;
