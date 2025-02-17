import React, { Fragment, useContext, useEffect, useState } from "react";
import { Col, Row } from "antd";
import { useGetConfig } from "@/hooks/hook-customs/useGetConfig";
import { useMobile } from "@/hooks/hook-customs/useWindowSize";
import AppLink from "@/components/AppLink";
import EllipsisText from "@/components/EllipsisText";
import { useIntl } from "react-intl";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/hooks";
import selectedAddress from "@/redux/address/selector";
import style from "./index.module.scss";
import { NFT_STANDARD } from "@/constants/nft";
import { EXTERNAL_URL } from "@/constants/routesPath";
import PolygonIcon from "@public/images/polygon_icon.png";
import { ExportOutlined } from "@ant-design/icons";
import ShortenAddress from "@/components/ShortenAddress";
import Image from "next/image";
import ChainSearchIcon from "@public/svg/find-icon.svg";
import { getIpfsLink } from "@/utils/utils";

type ChainInfoType = {
  label: string;
  prefixIcon?: string;
  address?: any;
  text?: string;
};

type ButtonLinkType = {
  href: string;
  text: string;
};

const ChainInfo = () => {
  const { ipfsGateway } = useGetConfig();
  const intl = useIntl();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const nftId = Array.isArray(id) ? id[0] : id;
  const { address } = useAppSelector(selectedAddress.getAddress);
  const [ipfsLink, setIpfsLink] = useState("");
  const nftData: any = queryClient.getQueryData([
    "getNftDetail",
    nftId,
    address,
  ]);

  const token = nftData?.token;
  useEffect(() => {
    const fetchIpfsLink = async () => {
      if (token?.cid) {
        const link = await getIpfsLink(token?.cid);
        setIpfsLink(link);
      }
    };

    fetchIpfsLink();
  }, [token?.cid]);

  const nftStandard = token
    ? (NFT_STANDARD.find((standard) => standard?.value === token?.standard)
        ?.label as string)
    : "common.null.text";

  const buttonLinkInfo = [
    {
      href: `${EXTERNAL_URL.POLYGON_SCAN_ADDRESS}/${token?.address}`,
      text: "NFT.detail.view.ploygon",
    },
    {
      href: `${ipfsGateway}${ipfsLink}`,
      text: "NFT.detail.view.ipfs",
    },
  ];

  const chainInfo = [
    {
      label: "NFT.detail.chain",
      text: "NFT.detail.polygon",
      prefixIcon: PolygonIcon,
    },
    {
      label: "NFT.detail.contract.address",
      address: token?.address,
    },
    {
      label: "NFT.detail.standard",
      text: nftStandard,
    },
  ];

  const renderButtonLink = ({ href, text }: ButtonLinkType) => {
    return (
      <div className={style.app_link}>
        <AppLink href={href} target="_blank" rel="noreferrer">
          <div className={style.info_button}>
            <EllipsisText
              text={intl.formatMessage({ id: text })}
              className={style.info_button_text}
            />
            <ExportOutlined className={style.info_button_icon} />
          </div>
        </AppLink>
      </div>
    );
  };

  const renderChainItem = ({
    label,
    text,
    prefixIcon,
    address,
  }: ChainInfoType) => {
    return (
      <Fragment>
        <EllipsisText
          text={intl.formatMessage({ id: label })}
          className={style.info}
        />
        <div className={style.info_text}>
          {prefixIcon && (
            <Image
              src={prefixIcon}
              alt={"prefix icon"}
              height={20}
              width={20}
              className={style.icon}
            />
          )}
          {text && <EllipsisText text={intl.formatMessage({ id: text })} />}
          {address && <ShortenAddress address={address} isCopy={true} />}
        </div>
      </Fragment>
    );
  };

  return (
    <div className={style.nft_detail_chain_info}>
      <div className={style.nft_detail_chain_info_header}>
        <Image
          src={ChainSearchIcon}
          alt="properties icon"
          height={24}
          width={24}
          className={style.nft_detail_chain_info_header_icon}
        />
        <EllipsisText
          className={style.nft_detail_chain_info_header_text}
          text={intl.formatMessage({ id: "NFT.detail.chain.information" })}
        />
      </div>
      <div className={style.nft_detail_chain_info_content}>
        <Row>
          {chainInfo.map((item: any, index) => (
            <Col
              key={index}
              xs={24}
              sm={24}
              className={style.nft_detail_chain_info_content_col}
            >
              {renderChainItem(item)}
            </Col>
          ))}

          <Col
            xs={24}
            sm={24}
            className={style.nft_detail_chain_info_content_col}
          >
            {buttonLinkInfo.map((item, index) => (
              <Fragment key={index}>{renderButtonLink(item)}</Fragment>
            ))}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ChainInfo;
