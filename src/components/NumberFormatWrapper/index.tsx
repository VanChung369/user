import { DECIMAL_SCALE } from '@/constants/number';
import classNames from 'classnames';
import { FC } from 'react';
import { NumericFormat } from 'react-number-format';
import { NumberFormatWrapperProps } from './typings';

const NumberFormatWrapper: FC<NumberFormatWrapperProps> = ({
  value,
  className,
  decimalScale = DECIMAL_SCALE,
  displayType = 'text',
  thousandSeparator = true,
  thousandsGroupStyle,
  customInput,
  ...props
}) => {
  return (
    <NumericFormat
      thousandsGroupStyle={thousandsGroupStyle}
      value={value}
      customInput={customInput}
      decimalScale={decimalScale}
      displayType={displayType}
      thousandSeparator={thousandSeparator}
      className={classNames(className)}
      {...props}
    />
  );
};

export default NumberFormatWrapper;
