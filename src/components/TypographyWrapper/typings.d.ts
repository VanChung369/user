import { ReactNode } from 'react';

export type TypographyWrapperProps = {
  isShorten?: boolean;
  copyable?: any;
  rowsNumber?: number;
  icon?: ReactNode;
  typeTypography?: string;
  className?: string;
  text?: string;
  customComponent?: any;
  children?: ReactNode;
  onChange?: (string) => any;
  tooltip?: boolean | ReactNode;
  editing?: boolean;
  maxLength?: number;
  minRows?: number;
  maxRows?: number;
  editableText?: string;
  onCancel?: function;
  onStart?: function;
  onEnd?: function;
  triggerType?: ('icon' | 'text')[];
  enterIcon?: ReactNode;
  textButton?: string;
  label?: any;
  helpText?: string;
  contentClass?: string;
  labelClassName?: string;
  iconClassName?: string;
  [key: string]: any;
};
