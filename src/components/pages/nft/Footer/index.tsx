import React from "react";
import { Col, Row } from "antd";
import Attributes from "./Attributes";
import style from "./index.module.scss";
import Tags from "./Tag";
import ChainInfo from "./ChainInfo";
import Info from "./Info";
import NFTs from "./NFTs";

const Footer = () => {
  return (
    <div className={style.nft_detail_page_footer}>
      <Row gutter={32}>
        <Col xs={24} sm={24} md={8}>
          <Tags />
          <Attributes />
          <ChainInfo />
        </Col>
        <Col xs={24} sm={24} md={16}>
          <Info />
        </Col>
      </Row>
      <Row gutter={32}>
        <NFTs />
      </Row>
    </div>
  );
};
export default Footer;
