import { Tag } from "antd";
import classnames from "classnames";
import { FC } from "react";
import style from "./index.module.scss";
import { TagWrapperProps } from "./typings";
import EllipsisText from "../EllipsisText";

const TagWrapper: FC<TagWrapperProps> = ({
  text,
  color = "magenta",
  className,
  ...props
}) => {
  return (
    <Tag color={color} className={classnames(style.tag, className)} {...props}>
      <EllipsisText
        text={text}
        tooltipText={text}
        className={style.tag__text}
      />
    </Tag>
  );
};

export default TagWrapper;
