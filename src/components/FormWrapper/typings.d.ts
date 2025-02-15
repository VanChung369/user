import { ReactNode } from 'react';

export type FormkWrapperProps = {
  customComponent?: any;
  type?: string;
  name: string;
  typeInput?: string | null;
  prefix?: any;
  placeholder?: any;
  options?: {
    value: string | number | null;
    name?: string | number;
    key?: string | number;
  }[];
  subLabel?: any;
  dropdownClassName?: string;
  className?: string;
  content?: any;
  label?: any;
  showLevelPassword?: boolean;
  maxLength?: number;
  onChange?: any;
  showSearch?: boolean;
  filterOption?: any;
  dropdownMatchSelectWidth?: any;
  labelClassName?: any;
  containerClassName?: string;
  errorClassName?: any;
  decimalScale?: number;
  autoFocus?: boolean;
  required?: boolean;
  children?: ReactNode;
  inputProps?: any;
  mode?: any;
  showArrow?: any;
  maxTagCount?: any;
  maxTagTextLength?: any;
  onSearch?: any;
  onKeyDown?: any;
  tagRender?: any;
  optionLabelProp?: any;
  values?: any;
  optionsType?: any;
  enableAllOption?: any;
  errorField?: string;
  description?: string | ReactNode;
  fetchData?: any;
  renderOption?: any;
  limit?: string | number;
  getPopupContainer?: any;
  value?: any;
  disabled?: boolean;
  unit?: string;
  thousandSeparator?: boolean;
  onValueChange?: any;
  onBlur?: any;
  isAllowed?: any;
  enterButton?: any;
  virtual?: boolean;
  rows?: number;
  validate?: any;
  format?: any;
  disabledDate?: any;
  allowClear?: boolean;
  showTime?: any;
  showNow?: boolean;
  showCount?: boolean;
  feildNameChange?: any;
  onChangeValue?: any;
  defaultValue?: any;
  suffix?: any;
  labelTootip?: any;
  disabledTime?: any;
  autoSize?: any;
  checked?: boolean;
  inputReadOnly?: boolean;
  listFileTypeSupport?: Array<any>;
  appendInput?: ReactNode;
  maxSize?: number;
  listItemIgnore?: any;
  width?: any;
  showCheckAll?: boolean;
  textTooltip?: string;
  textSelectAll?: any;
  helpText?: any;
  helpTextClassName?: any;
  autoComplete?: any;
  [key: string]: any;
};
