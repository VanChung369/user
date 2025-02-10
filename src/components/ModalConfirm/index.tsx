import React from "react";
import styles from "./index.module.scss";
import { ModalConfirmProps } from "./typing";
import cx from "classnames";
import ModalWrapper from "../ModalWrapper";
import ButtonWrapper from "../ButtonWrapper";
import { useIntl } from "react-intl";

const ModalConfirm = ({
  visible,
  onClose,
  onConfirm,
  title,
  decsription,
  confirmText,
  className,
  innerHtml,
  noCancel,
  loading,
  width,
  ...props
}: ModalConfirmProps) => {
  const intl = useIntl();

  return (
    <ModalWrapper
      open={visible}
      width={width || 550}
      onClose={onClose}
      {...props}
    >
      <div className={cx(styles.modal_confirm, className)}>
        <div className={styles.modal_confirm__title}>{title}</div>
        {innerHtml ? (
          <div
            className={styles.modal_confirm__description}
            dangerouslySetInnerHTML={{ __html: decsription }}
          />
        ) : (
          <div className={styles.modal_confirm__description}>{decsription}</div>
        )}
        {noCancel ? (
          <ButtonWrapper
            className={styles.modal_confirm__button_proceed}
            onClick={onConfirm}
            text={
              confirmText || intl.formatMessage({ id: "common.text.delete" })
            }
            variant="primary"
            loading={loading}
            disabled={loading}
          />
        ) : (
          <div className={styles.modal_confirm__button}>
            <ButtonWrapper
              className={styles.modal_confirm__button_cancel}
              onClick={onClose}
              text={intl.formatMessage({ id: "common.text.cancel" })}
              disabled={loading}
            />

            <ButtonWrapper
              className={styles.modal_confirm__button_confirm}
              onClick={onConfirm}
              text={
                confirmText || intl.formatMessage({ id: "common.text.delete" })
              }
              variant="primary"
              disabled={loading}
              loading={loading}
            />
          </div>
        )}
      </div>
    </ModalWrapper>
  );
};

export default ModalConfirm;
