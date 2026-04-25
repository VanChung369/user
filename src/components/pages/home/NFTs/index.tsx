"use client";
import style from "./index.module.scss";
import React, { useState } from "react";
import { Col, Row } from "antd";
import AppLink from "@/components/AppLink";
import { useIntl } from "react-intl";
import { useGetListNFTs } from "../hooks";
import classNames from "classnames";
import ButtonWrapper from "@/components/ButtonWrapper";
import EyeIcon from "@public/svg/Eye-icon.svg";
import NFTItem from "@/components/NFTItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useMobile } from "@/hooks/hook-customs/useWindowSize";
import NftDetailModal from "./NftDetailModal";
import Image from "next/image";
import ROUTES_PATH from "@/constants/routesPath";

const NFTs = () => {
  const intl = useIntl();
  const isMobile = useMobile();
  const { data } = useGetListNFTs();
  const [isShowNftDetail, setIsShowNftDetail] = useState(false);
  const [selectedNft, setSelectedNft] = useState({});

  const handleClickNft = (nft: any) => {
    setIsShowNftDetail(true);
    setSelectedNft(nft);
  };

  const NFT = data?.docs;

  return (
    <div className={classNames("container", style.nft)}>
      <div className={style.nft_box}>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between">
          <Col xs={24} sm={20} md={20} lg={20} xl={20} xxl={20}>
            <div className={style.nft_box__title}>
              {intl.formatMessage({ id: "home.banner.nft" })}
            </div>
            <div className={style.nft_box__title_content}>
              {intl.formatMessage({ id: "home.banner.nft.title" })}
            </div>
          </Col>

          <Col xs={24} sm={4} md={4} lg={4} xl={4} xxl={4}>
            <AppLink href={ROUTES_PATH.MARKETPLACE}>
              <ButtonWrapper
                className={style.nft_box__link}
                text={intl.formatMessage({
                  id: "home.banner.see.all",
                })}
                prefixIcon={<Image src={EyeIcon} alt={"eye icon"} />}
              />
            </AppLink>
          </Col>
        </Row>
      </div>

      <div>
        <Swiper
          spaceBetween={isMobile ? 16 : 32}
          slidesPerView={isMobile ? 1 : 4}
          navigation={true}
          scrollbar={{ draggable: true }}
          modules={[Navigation]}
          breakpoints={{
            1439: {
              slidesPerView: 4,
              spaceBetween: 32,
            },
            1360: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 12,
            },
            480: {
              slidesPerView: 1,
              spaceBetween: 16,
            },
          }}
        >
          {NFT &&
            NFT?.map((nft: any, index: any) => {
              return (
                <SwiperSlide key={index} onClick={() => handleClickNft(nft)}>
                  <NFTItem nft={nft} />
                </SwiperSlide>
              );
            })}
        </Swiper>
      </div>
      <NftDetailModal
        nft={selectedNft}
        visible={isShowNftDetail}
        onClose={() => setIsShowNftDetail(false)}
      />
    </div>
  );
};

export default NFTs;
