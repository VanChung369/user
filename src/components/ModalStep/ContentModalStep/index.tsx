import React from "react";
import classNames from "classnames";
import { ContentModalStepProps } from "./typing";
import style from "./index.module.scss";
import { useIntl } from "react-intl";

const ContentModalStep = ({
  icon,
  className,
  title,
  innerHtml,
  customDescription,
  description,
}: ContentModalStepProps) => {
  const intl = useIntl();

  return (
    <div className={classNames(style.modal_content, className)}>
      <p className={style.modal_content__title}>
        {title || intl.formatMessage({ id: "modal.failed" })}
      </p>
      {icon}
      {customDescription ? (
        <div className={style.modal_content__description}>
          {customDescription}
        </div>
      ) : innerHtml ? (
        <p
          className={style.modal_content__description}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      ) : (
        <p className={style.modal_content__description}>{description}</p>
      )}
    </div>
  );
};

export default ContentModalStep;
