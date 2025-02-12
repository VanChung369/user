import { ComponentType } from 'react';
import { InputAttributes } from 'react-number-format';

export type NumberFormatWrapperProps = {
  value: number | any;
  customInput?: ComponentType<InputAttributes>;
  defaultValue?: number | any;
  displayType?: 'text' | 'input';
  getInputRef?: any;
  isAllowed?: function;
  valueIsNumericString?: boolean;
  prefix?: symbol | any;
  onValueChange?: function;
  thousandsGroupStyle?: 'lakh' | 'thousand' | 'wan';
  thousandSeparator?: string;
  renderText?: function | any;
  allowLeadingZeros?: boolean;
  allowNegative?: boolean;
  allowedDecimalSeparators?: [] | any;
  decimalScale?: number;
  decimalSeparator?: string;
  fixedDecimalScale?: true;
  suffix?: string;
  className?: string;
  isNotFormatDecimal?: boolean;
  [key: string]: any;
};
