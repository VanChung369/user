import React from "react";
import Image from "next/image";
import style from "./index.module.scss";

type PreviewImageProps = {
  src: string;
  [key: string]: any;
};

const PreviewImage = ({ src, ...props }: PreviewImageProps) => {
  return (
    <div className={style.preview_image}>
      <Image
        alt={"nft image"}
        src={src}
        {...props}
        fill
        sizes="(max-width: 600px) 100vw, 50vw"
      />
    </div>
  );
};

export default PreviewImage;
