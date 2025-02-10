import React, { Fragment } from "react";
import { Modal, Typography } from "antd";
import { ModalWrapperProps } from "./typing";
import { CloseCircleOutlined } from "@ant-design/icons";
import style from "./index.module.scss";
const { Title } = Typography;

const ModalWrapper = ({
  children,
  title,
  onClose,
  showCloseIcon = true,
  width,
  destroyOnClose = true,
  maskClosable = true,
  ...props
}: ModalWrapperProps) => {
  return (
    <Modal
      footer={null}
      wrapClassName={style.modal}
      closable={false}
      width={width ?? 565}
      destroyOnClose={destroyOnClose}
      onCancel={onClose}
      maskClosable={maskClosable || !showCloseIcon}
      {...props}
    >
      <Fragment>
        {showCloseIcon && (
          <CloseCircleOutlined
            onClick={onClose}
            className={style.modal__icon_close}
          />
        )}
        <div className={style.modal__content}>
          <Title level={5} className={style.modal__content__title}>
            {title}
          </Title>
          {children}
        </div>
      </Fragment>
    </Modal>
  );
};

export default ModalWrapper;
