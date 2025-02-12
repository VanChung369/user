import { Typography } from "antd";
import classNames from "classnames";
import { FC, ReactNode, useMemo } from "react";

const { Paragraph } = Typography;
type TextSuffixProps = {
  text?: string;
  className?: string;
  icon?: ReactNode;
  enterIcon?: ReactNode;
  textTooltip?: string;
  onChange?: (text: string) => void;
  triggerType?: ("text" | "icon")[];
  maxLength?: number;
  maxRows?: number;
  minRows?: number;
  isShorten?: boolean;
  editing?: boolean;

  [key: string]: any;
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
const TextSuffix: FC<TextSuffixProps> = ({
  text,
  onChange,
  className,
  icon,
  textTooltip,
  enterIcon,
  maxLength,
  maxRows,
  minRows,
  triggerType = ["text"],
  editing,
  isShorten = false,
  ...props
}) => {
  const [
    editableStrWithSuffixStartPart,
    editableStrWithSuffixSuffixPart,
    editableStrShorten,
  ] = useMemo(() => {
    if (text) {
      return [text?.slice(0, -6), text?.slice(-6), text?.slice(0, 6)];
    }
    return "--";
  }, [text]);
  return (
    <Paragraph
      className={classNames(className)}
      editable={{
        icon: icon,
        tooltip: textTooltip,
        editing: editing,
        text: text,
        onChange: onChange,
        triggerType: triggerType,
        enterIcon: enterIcon,
        maxLength: maxLength,
        autoSize: { maxRows: maxRows, minRows: minRows },
      }}
      ellipsis={{
        suffix: isShorten
          ? text
            ? `${editableStrShorten}...${editableStrWithSuffixSuffixPart}`
            : "--"
          : editableStrWithSuffixSuffixPart,
        tooltip: text,
      }}
      {...props}
    >
      {!isShorten && editableStrWithSuffixStartPart}
    </Paragraph>
  );
};

export default TextSuffix;
