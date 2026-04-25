import React from "react";
import { Col, Row } from "antd";
import Info from "./Info";
import Preview from "./Preview";
import style from "./index.module.scss";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/hooks";
import selectedAddress from "@/redux/address/selector";

const General = () => {
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
    <div className={style.nft_detail_general}>
      <Row gutter={40}>
        <Col xs={24} sm={24} md={13} className={style.nft_detail_general_info}>
          <Info />
        </Col>
        <Col
          xs={24}
          sm={24}
          md={11}
          className={style.nft_detail_general_preview}
        >
          {nftData && <Preview src={nftData?.image.url} />}
        </Col>
      </Row>
    </div>
  );
};

export default General;
