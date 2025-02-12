import style from "./index.module.scss";

const TagItem = ({ tag }: any) => {
  return (
    <div className={style.tag_card}>
      <div className={style.tag_card_photo_icon}>
        <img
          className={style.tag_card_photo_icon_image}
          src={tag?.icon.url}
          alt="Image Placeholder"
        />
      </div>
      <div className={style.tag_card_name}>
        <div className={style.tag_card_name_text}>{tag?.name}</div>
      </div>
    </div>
  );
};

export default TagItem;
