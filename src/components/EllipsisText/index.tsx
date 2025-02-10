import { useEffect, useState, useRef, FC } from "react";
import { Tooltip } from "antd";
import style from "./index.module.scss";
import classNames from "classnames";

type EllipsisTextProps = {
  text?: any;
  className?: string;
  tooltipText?: string;
  innerHtml?: boolean;
  tooltipClassName?: string;
  alwaysShowTooltip?: boolean;
  maxWidth?: number;
  [key: string]: any;
};

const EllipsisText: FC<EllipsisTextProps> = ({
  className,
  text,
  tooltipClassName,
  alwaysShowTooltip,
  maxWidth,
  tooltipText,
  innerHtml,
  ...props
}) => {
  const [isOverflow, setIsOverflow] = useState(false);
  const dataRef = useRef<any>();

  useEffect(() => {
    if (maxWidth) {
      setIsOverflow(
        dataRef.current.scrollWidth > dataRef.current.clientWidth ||
          dataRef.current.scrollWidth > maxWidth
      );
    } else {
      setIsOverflow(dataRef.current.scrollWidth > dataRef.current.clientWidth);
    }
  }, [text, maxWidth]);

  const renderContent = () => {
    return !innerHtml ? (
      <div ref={dataRef} className={classNames(style.textOverflow, className)}>
        {text}
      </div>
    ) : (
      <div
        ref={dataRef}
        className={classNames(style.textOverflow, className)}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  };

  return isOverflow || alwaysShowTooltip ? (
    <Tooltip
      title={tooltipText || text}
      overlayClassName={tooltipClassName ? tooltipClassName : "tooltip-detail"}
    >
      {renderContent()}
    </Tooltip>
  ) : (
    renderContent()
  );
};

export default EllipsisText;
