import style from "./index.module.scss";
import Image from "next/image";

const TagItem = ({ tag }: any) => {
  return (
    <div className={style.tag_card}>
      <div className={style.tag_card_photo_icon}>
        <Image
          className={style.tag_card_photo_icon_image}
          src={tag?.icon.url}
          alt="Image Placeholder"
          fill
          sizes="(max-width: 600px) 100vw, 50vw"
        />
      </div>
      <div className={style.tag_card_name}>
        <div className={style.tag_card_name_text}>{tag?.name}</div>
      </div>
    </div>
  );
};

export default TagItem;
