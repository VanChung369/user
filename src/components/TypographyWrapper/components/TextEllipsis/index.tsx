import { Typography } from "antd";
import classNames from "classnames";
import { FC, ReactNode } from "react";

const { Text } = Typography;

type TextEllipsisProps = {
  text?: string;
  className?: string;
  textTooltip?: string;
  copyable?: any;
  ellipsis?: any;
  isShorten?: boolean;
  children?: ReactNode;
  [key: string]: any;
};

const TextEllipsis: FC<TextEllipsisProps> = ({
  text,
  className,
  copyable = false,
  textTooltip,
  ellipsis = { tooltip: textTooltip ?? text },
  isShorten = false,
  children,
  ...props
}) => {
  return (
    <Text
      className={classNames(className)}
      copyable={copyable}
      ellipsis={isShorten ? ellipsis : isShorten}
      {...props}
    >
      {text ?? "--"}
      {children}
    </Text>
  );
};

export default TextEllipsis;
