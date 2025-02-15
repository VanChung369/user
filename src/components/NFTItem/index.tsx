import { Col, Row } from "antd";
import { useIntl } from "react-intl";
import style from "./index.module.scss";
import ShortenAddress from "@/components/ShortenAddress";
import ProfileIcon from "@public/images/no-profile-md.png";
import EllipsisText from "../EllipsisText";
import Image from "next/image";

const NFTItem = ({ nft }: any) => {
  const intl = useIntl();
  return (
    <div className={style.nft_card}>
      <div className={style.nft_card_image}>
        <Image
          className={style.nft_card_image_placeholder}
          src={nft?.image?.url}
          alt="Image Placeholder"
          fill
          sizes="(max-width: 600px) 100vw, 50vw"
        />
      </div>
      <div className={style.nft_card_info}>
        <div className={style.nft_card_artst_info}>
          <div className={style.nft_card_nft_info_name}>
            <EllipsisText text={nft?.name} tooltipText={nft?.name} />
          </div>
          <div className={style.nft_card_artist_info_avatar_name}>
            <div className={style.nft_card_artist_info_avatar}>
              <div className={style.nft_card_artist_info_avatar_asset}>
                <Image
                  className={style.nft_card_artist_info_avatar_placeholder}
                  src={
                    nft?.user?.image?.url
                      ? nft?.user?.image?.url
                      : ProfileIcon.src
                  }
                  alt="Avatar Placeholder"
                  fill
                  sizes="(max-width: 600px) 100vw, 50vw"
                />
              </div>
            </div>
            <div className={style.nft_card_artist_info_name}>
              <ShortenAddress address={nft?.creatorAddress} extraShort={true} />
            </div>
          </div>
        </div>
        <div className={style.nft_card_info_additional}>
          <div className={style.nft_card_info_price}>
            <div className={style.nft_card_info_price_title}>
              {intl.formatMessage({ id: "home.banner.nft.price" })}
            </div>
            <div className={style.nft_card_info_price_content}>
              {nft?.unitPrice ? (
                <EllipsisText
                  text={`${nft?.unitPrice} ${nft?.currency?.symbol}`}
                  tooltipText={nft?.unitPrice}
                />
              ) : (
                "---"
              )}
            </div>
          </div>
          <div className={style.nft_card_info_type}>
            <div className={style.nft_card_info_type_title}>
              {intl.formatMessage({ id: "home.banner.nft.type" })}
            </div>
            <div className={style.nft_card_info_type_content}>
              {nft?.token.standard}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTItem;
