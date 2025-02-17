import React, { Fragment, useContext } from "react";
import { Col, Row } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/hooks";
import { useParams } from "next/navigation";
import selectedAddress from "@/redux/address/selector";
import EllipsisText from "@/components/EllipsisText";
import { useIntl } from "react-intl";
import style from "./index.module.scss";
import Image from "next/image";
import PropertiesIcon from "@public/svg/properties-icon.svg";

const Attributes = () => {
  const intl = useIntl();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const nftId = Array.isArray(id) ? id[0] : id;
  const { address } = useAppSelector(selectedAddress.getAddress);
  const nftData: any = queryClient.getQueryData([
    "getNftDetail",
    nftId,
    address,
  ]);

  return (
    <div className={style.nft_detail_attributes}>
      <div className={style.nft_detail_attributes_header}>
        <Image
          src={PropertiesIcon}
          alt="properties icon"
          height={24}
          width={24}
          className={style.nft_detail_attributes_header_icon}
        />
        <EllipsisText
          className={style.nft_detail_attributes_header_text}
          text={intl.formatMessage({ id: "NFT.detail.attributes" })}
        />
      </div>
      <div className={style.nft_detail_attributes_content}>
        {nftData?.attributes &&
          Object.entries(nftData?.attributes).map(
            ([key, value]: any, index) => {
              let textValue;
              if (typeof value === "object") {
                textValue = value?.text;
              } else {
                textValue = value;
              }

              return (
                <Row justify="space-between" key={index}>
                  <Col xs={15} sm={15}>
                    <EllipsisText
                      text={key}
                      className={style.nft_detail_attributes_content_lable}
                    />
                  </Col>
                  <Col xs={9} sm={9}>
                    <div className={style.nft_detail_attributes_content_text}>
                      <EllipsisText text={textValue} />
                    </div>
                  </Col>
                </Row>
              );
            }
          )}
      </div>
    </div>
  );
};

export default Attributes;
