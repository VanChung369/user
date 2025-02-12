import { Row, Typography } from "antd";
import classNames from "classnames";
import { FC, Fragment, useCallback, useEffect, useRef, useState } from "react";
import ButtonWrapper from "@/components/ButtonWrapper";
import styleLess from "./index.module.scss";
import { useIntl } from "react-intl";

const { Paragraph } = Typography;

type TextExpandProps = {
  text?: string;
  textButton?: string;
  className?: string;
  rowsNumber?: number;
  justify?:
    | "center"
    | "start"
    | "end"
    | "space-around"
    | "space-between"
    | "space-evenly"
    | undefined;
  classNameMore?: any;
  classNameLess?: any;
  [key: string]: any;
};

const TextExpand: FC<TextExpandProps> = ({
  text,
  className,
  justify = "start",
  textButton,
  rowsNumber,
  classNameMore,
  classNameLess,
  ...props
}) => {
  const intl = useIntl();
  const [ellipsis, setEllipsis] = useState(true);
  const [isExpandable, setIsExpandable] = useState(false);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  const checkExpandable = useCallback(() => {
    if (paragraphRef.current) {
      const { clientHeight, scrollHeight } = paragraphRef.current;
      setIsExpandable(scrollHeight > clientHeight);
    }
  }, []);

  useEffect(() => {
    checkExpandable();
  }, [text, checkExpandable]);

  return (
    <Fragment>
      <Paragraph
        ref={paragraphRef}
        className={classNames(
          className,
          isExpandable ? classNameMore : classNameLess
        )}
        {...props}
        ellipsis={
          ellipsis
            ? { rows: rowsNumber || 5, expandable: "collapsible", symbol: "" }
            : false
        }
      >
        {text ?? "--"}
      </Paragraph>
      {isExpandable && (
        <Row justify={justify}>
          <ButtonWrapper
            {...props}
            className={styleLess.text_expand__button}
            onClick={() => {
              setEllipsis(!ellipsis);
            }}
            text={
              textButton || ellipsis
                ? intl.formatMessage({ id: "common.textExpand.readMore" })
                : intl.formatMessage({ id: "common.textExpand.showLess" })
            }
          />
        </Row>
      )}
    </Fragment>
  );
};

export default TextExpand;
