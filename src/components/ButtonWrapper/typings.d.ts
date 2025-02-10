declare const ButtonVarients: ['default', 'primary', 'link', 'secondary'];
declare type ButtonVarient = (typeof ButtonVarients)[number];

export type ButtonWrapperProps = {
  variant?: ButtonVarient | undefined;
  prefixIcon?: ReactNode;
  afterIcon?: ReactNode;
  className?: any;
  onClick?: MouseEventHandler<HTMLElement>;
  text: ReactNode;
  disabled?: boolean;
  htmlType?: string | any;
  loading?: boolean;
  href?: string;
  [key: string]: any;
};
