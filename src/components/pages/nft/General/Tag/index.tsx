import React from "react";
import { Col, Row } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/hooks";
import { useParams } from "next/navigation";
import selectedAddress from "@/redux/address/selector";
import EllipsisText from "@/components/EllipsisText";
import style from "./index.module.scss";
import AppLink from "@/components/AppLink";
import ROUTES_PATH, { QUERY } from "@/constants/routesPath";

const Tags = () => {
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
      <div className={style.nft_detail_tag_content}>
        <Row>
          {nftData?.tag &&
            nftData?.tag.map((value: any, index: any) => {
              return (
                <Col
                  key={index}
                  xs={6}
                  sm={6}
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
