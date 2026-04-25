import { TYPE_TYPOGRAPHY } from "@/constants/type";
import classNames from "classnames";
import { FC, memo } from "react";
import style from "./index.module.scss";
import { TypographyWrapperProps } from "./typings";
import TextEllipsis from "./components/TextEllipsis";
import TextExpand from "./components/TextExpand";
import TextSuffix from "./components/TextSuffix";
import TextHelp from "./components/TextHelp";

const TypographyWrapper: FC<TypographyWrapperProps> = ({
  text,
  copyable,
  customComponent,
  isShorten,
  className,
  typeTypography,
  textTooltip,
  triggerType,
  minRows,
  maxRows,
  enterIcon,
  maxLength,
  icon,
  onChange,
  editing,
  children,
  rowsNumber,
  textButton,
  label,
  helpText,
  contentClass,
  labelClassName,
  iconClassName,
  ...props
}) => {
  let typographyRender = customComponent;

  switch (typeTypography) {
    case TYPE_TYPOGRAPHY.TEXT_SUFFIX:
      typographyRender = (
        <TextSuffix
          text={text}
          onChange={onChange}
          textTooltip={textTooltip}
          icon={icon}
          editing={editing}
          triggerType={triggerType}
          enterIcon={enterIcon}
          maxLength={maxLength}
          className={className}
          minRows={minRows}
          maxRows={maxRows}
          isShorten={isShorten}
          copyable={copyable}
          {...props}
        />
      );
      break;
    case TYPE_TYPOGRAPHY.TEXT_ELLIPSIS:
      typographyRender = (
        <TextEllipsis
          isShorten={isShorten}
          copyable={copyable}
          text={text}
          className={className}
          textTooltip={textTooltip}
          {...props}
        >
          {children}
        </TextEllipsis>
      );
      break;
    case TYPE_TYPOGRAPHY.TEXT_EXPAND:
      typographyRender = (
        <TextExpand
          text={text}
          className={className}
          rowsNumber={rowsNumber}
          textButton={textButton}
          {...props}
        />
      );
      break;
    case TYPE_TYPOGRAPHY.TEXT_HELP:
      typographyRender = (
        <TextHelp
          label={label}
          className={className}
          helpText={helpText}
          contentClass={contentClass}
          labelClassName={labelClassName}
          iconClassName={iconClassName}
        >
          {children}
        </TextHelp>
      );
      break;
    default:
      typographyRender = (
        <TextSuffix
          text={text}
          isShorten={isShorten}
          className={className}
          {...props}
        />
      );
      break;
  }

  return <div className={classNames(style.paragraph)}>{typographyRender}</div>;
};

export default memo(TypographyWrapper);
