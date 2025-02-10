export type ModalWrapperProps = {
  title?: any;
  onClose?: any;
  showCloseIcon?: boolean;
  open: boolean;
  width?: number | string;
  maskClosable?: boolean;
  wrapClassName?: string;
  getContainer?: any;
  destroyOnClose?: boolean;
  [key: string]: any;
};
