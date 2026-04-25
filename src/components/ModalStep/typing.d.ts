export type ModalStepProps = {
  visible: boolean;
  loadingSrc?: string;
  innerHtml?: boolean;

  failed?: boolean;
  failedDescription?: ReactNode;
  failedTitle?: string;
  failedSrc?: string;
  onFailedClose?: () => void;
  failedClassName?: string;
  textFailedDescription?: string;

  successfulDescription?: ReactNode;
  successful?: boolean;
  successfulTitle?: string;
  successfulSrc?: string;
  onSuccessfulClose?: () => void;
  successfullClassName?: any;
  textSuccessfulDescription?: string;

  processing?: boolean;
  processingTitle?: string;
  processingSrc?: string;
  processingDescription?: ReactNode;
  processingClassName?: any;
  textProcessingDescription?: string;

  maskClosable?: boolean;
  showCloseIcon?: boolean;
  [key: string]: any;
};
