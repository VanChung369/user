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
import AppLink from "@/components/AppLink";
import ROUTES_PATH, { QUERY } from "@/constants/routesPath";

const Tags = () => {
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
    <div className={style.nft_detail_tag}>
      <div className={style.nft_detail_tag_header}>
        <Image
          src={PropertiesIcon}
          alt="properties icon"
          height={24}
          width={24}
          className={style.nft_detail_tag_header_icon}
        />
        <EllipsisText
          className={style.nft_detail_tag_header_text}
          text={intl.formatMessage({ id: "NFT.detail.tags" })}
        />
      </div>
      <div className={style.nft_detail_tag_content}>
        <Row justify="space-between">
          {nftData?.tag &&
            nftData?.tag.map((value: any, index: any) => {
              return (
                <Col
                  key={index}
                  xs={8}
                  sm={8}
                  className={style.nft_detail_tag_content_col}
                >
                  <AppLink
                    href={`${ROUTES_PATH.MARKETPLACE}?${QUERY.TAG}=${value?.id}`}
                  >
                    <EllipsisText
                      text={value?.name}
                      className={style.nft_detail_tag_content_text}
                    />
                  </AppLink>
                </Col>
              );
            })}
        </Row>
      </div>
    </div>
  );
};

export default Tags;
