import style from "./index.module.scss";
import React, { useState } from "react";
import { Col, Row } from "antd";
import AppLink from "@/components/AppLink";
import { useIntl } from "react-intl";
import classNames from "classnames";
import NFTItem from "@/components/NFTItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useMobile } from "@/hooks/hook-customs/useWindowSize";
import ROUTES_PATH from "@/constants/routesPath";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/hooks";
import selectedAddress from "@/redux/address/selector";
import { useGetListNFTs } from "../../hooks";

const NFTs = () => {
  const intl = useIntl();
  const isMobile = useMobile();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const nftId = Array.isArray(id) ? id[0] : id;
  const { address } = useAppSelector(selectedAddress.getAddress);
  const nftData: any = queryClient.getQueryData([
    "getNftDetail",
    nftId,
    address,
  ]);
  const { data } = useGetListNFTs({ collection: nftData?.collection?.id[0] });
  const NFT = data?.docs;

  return (
    <div className={classNames("container", style.nft)}>
      <div className={style.nft_box}>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between">
          <Col xs={24} sm={20} md={20} lg={20} xl={20} xxl={20}>
            <div className={style.nft_box__title}>
              {intl.formatMessage({ id: "NFT.detail.more.nfts.collection" })}
            </div>
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
                <SwiperSlide key={index}>
                  <AppLink href={`${ROUTES_PATH.NFT_DETAIL}/${nft?._id}`}>
                    <NFTItem nft={nft} />
                  </AppLink>
                </SwiperSlide>
              );
            })}
        </Swiper>
      </div>
    </div>
  );
};

export default NFTs;
