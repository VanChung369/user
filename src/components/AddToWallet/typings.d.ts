export type AddToWalletProps = {
  variant?: ButtonVarient;
  prefixIcon?: ReactNode;
  afterIcon?: ReactNode;
  className?: any;
  onClick?: MouseEventHandler<HTMLElement>;
  text: ReactNode;
  disabled?: boolean;
  htmlType?: string | any;
  loading?: boolean;
  href?: string;
  walletType?: string;

  [key: string]: any;
};
