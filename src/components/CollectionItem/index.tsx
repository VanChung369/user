import style from "./index.module.scss";
import ShortenAddress from "@/components/ShortenAddress";
import ProfileIcon from "@public/images/no-profile-md.png";
import Image from "next/image";

const CollectionItem = ({ collection }: any) => {
  const nftData =
    collection?.nft?.length > 2
      ? collection?.nft?.slice(1, 3)
      : collection?.nft;

  return (
    <div className={style.collection_card}>
      <div className={style.collection_card_content}>
        <div>
          <img
            className={style.primary_photo}
            src={collection?.nft[0].image.url}
            alt="Primary Photo Placeholder"
          />
        </div>
        <div className={style.content_frame}>
          {nftData &&
            nftData?.map((nft: any, index: any) => {
              return (
                <Image
                  key={index}
                  className={style.secondary_photo}
                  src={nft.image.url}
                  alt="Secondary Photo Placeholder"
                  width={100}
                  height={100}
                />
              );
            })}

          <div className={style.secondary_text}>
            <div className={style.secondary_text_middle}>
              {collection?.nftCount}+
            </div>
          </div>
        </div>
      </div>
      <div className={style.collection_card_info}>
        <div className={style.info_name}>{collection?.name}</div>
        <div className={style.info_artist}>
          <div className={style.info_artist_avatar}>
            <Image
              className={style.info_artist_avatar_image}
              src={
                collection?.user?.image?.url
                  ? collection?.user?.image?.url
                  : ProfileIcon.src
              }
              alt="Avatar Placeholder"
              width={24}
              height={24}
            />
          </div>
          <div className={style.info_artist_name}>
            <ShortenAddress
              address={collection?.creatorAddress}
              extraShort={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionItem;
