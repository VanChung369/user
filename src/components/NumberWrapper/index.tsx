import PropTypes from 'prop-types';
import React from 'react';

import {
  noop,
  returnTrue,
  charIsNumber,
  escapeRegExp,
  fixLeadingZero,
  limitToScale,
  roundToPrecision,
  omit,
  setCaretPosition,
  splitDecimal,
  findChangedIndex,
  clamp,
  applyThousandSeparator,
  getCurrentCaretPosition,
  addInputMode,
  isNil,
  toNumericString,
} from './utils';

const propTypes = {
  thousandSeparator: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([true])]),
  decimalSeparator: PropTypes.string,
  allowedDecimalSeparators: PropTypes.arrayOf(PropTypes.string),
  thousandsGroupStyle: PropTypes.oneOf(['thousand', 'lakh', 'wan']),
  decimalScale: PropTypes.number,
  fixedDecimalScale: PropTypes.bool,
  displayType: PropTypes.oneOf(['input', 'text']),
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  format: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  removeFormatting: PropTypes.func,
  mask: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isNumericString: PropTypes.bool,
  customInput: PropTypes.elementType,
  allowNegative: PropTypes.bool,
  allowEmptyFormatting: PropTypes.bool,
  allowLeadingZeros: PropTypes.bool,
  onValueChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  type: PropTypes.oneOf(['text', 'tel', 'password']),
  isAllowed: PropTypes.func,
  renderText: PropTypes.func,
  getInputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
  inputProps: PropTypes.any,
};

const defaultProps = {
  displayType: 'input',
  decimalSeparator: '.',
  thousandsGroupStyle: 'thousand',
  fixedDecimalScale: false,
  prefix: '',
  suffix: '',
  allowNegative: true,
  allowEmptyFormatting: false,
  allowLeadingZeros: false,
  isNumericString: false,
  type: 'text',
  onValueChange: noop,
  onChange: noop,
  onKeyDown: noop,
  onMouseUp: noop,
  onFocus: noop,
  onBlur: noop,
  isAllowed: returnTrue,
};
class NumberWrapper extends React.Component<any> {
  state: {
    value?: string;
    numAsString?: string;
    mounted: boolean;
  };
  focusTimeout: any;
  focusedElm: any;
  selectionBeforeInput: {
    selectionStart: number;
    selectionEnd: number;
  };
  static defaultProps: Object;
  constructor(props: Object) {
    super(props);

    const { defaultValue } = props as any;

    //validate props
    this.validateProps();

    const formattedValue = this.formatValueProp(defaultValue);

    this.state = {
      value: formattedValue,
      numAsString: this.removeFormatting(formattedValue),
      mounted: false,
    };

    this.selectionBeforeInput = {
      selectionStart: 0,
      selectionEnd: 0,
    };

    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  componentDidMount() {
    this.setState({
      mounted: true,
    });
  }

  componentDidUpdate(prevProps: Object) {
    this.updateValueIfRequired(prevProps);
  }

  componentWillUnmount() {
    clearTimeout(this.focusTimeout);
  }

  updateValueIfRequired(prevProps: Object) {
    const { props, state, focusedElm } = this;
    const { value: stateValue, numAsString: lastNumStr = '' } = state;

    if (prevProps !== props) {
      this.validateProps();

      const lastValueWithNewFormat = this.formatNumString(lastNumStr);

      const formattedValue = isNil(props.value) ? lastValueWithNewFormat : this.formatValueProp();
      const numAsString = this.removeFormatting(formattedValue);

      const floatValue = parseFloat(numAsString);
      const lastFloatValue = parseFloat(lastNumStr);

      if (
        ((!isNaN(floatValue) || !isNaN(lastFloatValue)) && floatValue !== lastFloatValue) ||
        lastValueWithNewFormat !== stateValue ||
        (focusedElm === null && formattedValue !== stateValue)
      ) {
        this.updateValue({ formattedValue, numAsString, input: focusedElm });
      }
    }
  }

  getFloatString(num = '') {
    const { decimalScale } = this.props;
    const { decimalSeparator } = this.getSeparators();
    const numRegex = this.getNumberRegex(true);

    const hasNegation = num[0] === '-';
    if (hasNegation) num = num.replace('-', '');

    if (decimalSeparator && decimalScale === 0) {
      num = num.split(decimalSeparator)[0];
    }

    num = (num.match(numRegex) || []).join('').replace(decimalSeparator, '.');

    const firstDecimalIndex = num.indexOf('.');

    if (firstDecimalIndex !== -1) {
      num = `${num.substring(0, firstDecimalIndex)}.${num
        .substring(firstDecimalIndex + 1, num.length)
        .replace(new RegExp(escapeRegExp(decimalSeparator), 'g'), '')}`;
    }

    if (hasNegation) num = '-' + num;

    return num;
  }

  getNumberRegex(g: boolean, ignoreDecimalSeparator?: boolean) {
    const { format, decimalScale } = this.props;
    const { decimalSeparator } = this.getSeparators();
    return new RegExp(
      '\\d' +
        (decimalSeparator && decimalScale !== 0 && !ignoreDecimalSeparator && !format
          ? '|' + escapeRegExp(decimalSeparator)
          : ''),
      g ? 'g' : undefined,
    );
  }

  getSeparators() {
    const { decimalSeparator } = this.props;
    let { thousandSeparator, allowedDecimalSeparators } = this.props;

    if (thousandSeparator === true) {
      thousandSeparator = ',';
    }
    if (!allowedDecimalSeparators) {
      allowedDecimalSeparators = [decimalSeparator, '.'];
    }

    return {
      decimalSeparator,
      thousandSeparator,
      allowedDecimalSeparators,
    };
  }

  getMaskAtIndex(index: number) {
    const { mask = ' ' } = this.props;
    if (typeof mask === 'string') {
      return mask;
    }

    return mask[index] || ' ';
  }

  getValueObject(formattedValue: string, numAsString: string) {
    const floatValue = parseFloat(numAsString);

    return {
      formattedValue,
      value: numAsString,
      floatValue: isNaN(floatValue) ? undefined : floatValue,
    };
  }

  validateProps() {
    const { mask } = this.props;
    const { decimalSeparator, thousandSeparator } = this.getSeparators();

    if (decimalSeparator === thousandSeparator) {
      throw new Error(`
          Decimal separator can't be same as thousand separator.
          thousandSeparator: ${thousandSeparator} (thousandSeparator = {true} is same as thousandSeparator = ",")
          decimalSeparator: ${decimalSeparator} (default value for decimalSeparator is .)
       `);
    }

    //validate mask
    if (mask) {
      const maskAsStr = mask === 'string' ? mask : mask.toString();
      if (maskAsStr.match(/\d/g)) {
        throw new Error(`
          Mask ${mask} should not contain numeric character;
        `);
      }
    }
  }

  setPatchedCaretPosition(el: HTMLInputElement, caretPos: number, currentValue: string) {
    setCaretPosition(el, caretPos);
    setTimeout(() => {
      if (el.value === currentValue) setCaretPosition(el, caretPos);
    }, 0);
  }

  correctCaretPosition(value: string, caretPos: number, direction?: string) {
    const { prefix, suffix, format } = this.props;

    if (value === '') return 0;

    caretPos = clamp(caretPos, 0, value.length);

    if (!format) {
      const hasNegation = value[0] === '-';
      return clamp(caretPos, prefix.length + (hasNegation ? 1 : 0), value.length - suffix.length);
    }

    if (typeof format === 'function') return caretPos;

    if (format[caretPos] === '#' && charIsNumber(value[caretPos])) return caretPos;

    if (format[caretPos - 1] === '#' && charIsNumber(value[caretPos - 1])) return caretPos;

    const firstHashPosition = format.indexOf('#');
    const lastHashPosition = format.lastIndexOf('#');

    caretPos = clamp(caretPos, firstHashPosition, lastHashPosition + 1);

    const nextPos = format.substring(caretPos, format.length).indexOf('#');
    let caretLeftBound = caretPos;
    const caretRightBound = caretPos + (nextPos === -1 ? 0 : nextPos);

    while (
      caretLeftBound > firstHashPosition &&
      (format[caretLeftBound] !== '#' || !charIsNumber(value[caretLeftBound]))
    ) {
      caretLeftBound -= 1;
    }

    const goToLeft =
      !charIsNumber(value[caretRightBound]) ||
      (direction === 'left' && caretPos !== firstHashPosition) ||
      caretPos - caretLeftBound < caretRightBound - caretPos;

    if (goToLeft) {
      return charIsNumber(value[caretLeftBound]) ? caretLeftBound + 1 : caretLeftBound;
    }

    return caretRightBound;
  }

  getCaretPosition(inputValue: string, formattedValue: string, caretPos: number) {
    const { format } = this.props;
    const stateValue = this.state.value;
    const numRegex = this.getNumberRegex(true);
    const inputNumber = (inputValue.match(numRegex) || []).join('');
    const formattedNumber = (formattedValue.match(numRegex) || []).join('');
    let j, i;

    j = 0;

    for (i = 0; i < caretPos; i++) {
      const currentInputChar = inputValue[i] || '';
      const currentFormatChar = formattedValue[j] || '';
      if (!currentInputChar.match(numRegex) && currentInputChar !== currentFormatChar) continue;

      if (
        currentInputChar === '0' &&
        currentFormatChar.match(numRegex) &&
        currentFormatChar !== '0' &&
        inputNumber.length !== formattedNumber.length
      )
        continue;

      while (currentInputChar !== formattedValue[j] && j < formattedValue.length) j++;
      j++;
    }

    if (typeof format === 'string' && !stateValue) {
      j = formattedValue.length;
    }

    j = this.correctCaretPosition(formattedValue, j);

    return j;
  }

  removePrefixAndSuffix(val: string) {
    const { format, prefix, suffix } = this.props;

    if (!format && val) {
      const isNegative = val[0] === '-';

      if (isNegative) val = val.substring(1, val.length);

      val = prefix && val.indexOf(prefix) === 0 ? val.substring(prefix.length, val.length) : val;

      const suffixLastIndex = val.lastIndexOf(suffix);
      val =
        suffix && suffixLastIndex !== -1 && suffixLastIndex === val.length - suffix.length
          ? val.substring(0, suffixLastIndex)
          : val;

      if (isNegative) val = '-' + val;
    }

    return val;
  }

  removePatternFormatting(val: string) {
    const { format } = this.props;
    const formatArray = format.split('#').filter((str: string) => str !== '');
    let start = 0;
    let numStr = '';

    for (let i = 0, ln = formatArray.length; i <= ln; i++) {
      const part = formatArray[i] || '';

      const index = i === ln ? val.length : val.indexOf(part, start);

      if (index === -1) {
        numStr = val;
        break;
      } else {
        numStr += val.substring(start, index);
        start = index + part.length;
      }
    }

    return (numStr.match(/\d/g) || []).join('');
  }

  removeFormatting(val: string) {
    const { format, removeFormatting } = this.props;
    if (!val) return val;

    if (!format) {
      val = this.removePrefixAndSuffix(val);
      val = this.getFloatString(val);
    } else if (typeof format === 'string') {
      val = this.removePatternFormatting(val);
    } else if (typeof removeFormatting === 'function') {
      //condition need to be handled if format method is provide,
      val = removeFormatting(val);
    } else {
      val = (val.match(/\d/g) || []).join('');
    }
    return val;
  }

  formatWithPattern(numStr: string) {
    const { format } = this.props;
    let hashCount = 0;
    const formattedNumberAry = format.split('');
    for (let i = 0, ln = format.length; i < ln; i++) {
      if (format[i] === '#') {
        formattedNumberAry[i] = numStr[hashCount] || this.getMaskAtIndex(hashCount);
        hashCount += 1;
      }
    }
    return formattedNumberAry.join('');
  }

  formatAsNumber(numStr: string) {
    const { decimalScale, fixedDecimalScale, prefix, suffix, allowNegative, thousandsGroupStyle } =
      this.props;
    const { thousandSeparator, decimalSeparator } = this.getSeparators();

    const hasDecimalSeparator = numStr.indexOf('.') !== -1 || (decimalScale && fixedDecimalScale);
    let { beforeDecimal, afterDecimal } = splitDecimal(numStr, allowNegative);
    const { addNegation } = splitDecimal(numStr, allowNegative);

    if (decimalScale !== undefined)
      afterDecimal = limitToScale(afterDecimal, decimalScale, fixedDecimalScale);

    if (thousandSeparator) {
      beforeDecimal = applyThousandSeparator(beforeDecimal, thousandSeparator, thousandsGroupStyle);
    }

    if (prefix) beforeDecimal = prefix + beforeDecimal;
    if (suffix) afterDecimal = afterDecimal + ' ' + suffix;

    if (addNegation) beforeDecimal = '-' + beforeDecimal;

    numStr = beforeDecimal + ((hasDecimalSeparator && decimalSeparator) || '') + afterDecimal;

    return numStr;
  }

  formatNumString(numStr = '') {
    const { format, allowEmptyFormatting } = this.props;
    let formattedValue = numStr;

    if (numStr === '' && !allowEmptyFormatting) {
      formattedValue = '';
    } else if (numStr === '-' && !format) {
      formattedValue = '-';
    } else if (typeof format === 'string') {
      formattedValue = this.formatWithPattern(formattedValue);
    } else if (typeof format === 'function') {
      formattedValue = format(formattedValue);
    } else {
      formattedValue = this.formatAsNumber(formattedValue);
    }

    return formattedValue;
  }

  formatValueProp(defaultValue?: string | number) {
    const { format, decimalScale, fixedDecimalScale, allowEmptyFormatting } = this.props;
    let { value, isNumericString } = this.props;

    value = isNil(value) ? defaultValue : value;

    const isNonNumericFalsy = !value && value !== 0;

    if (isNonNumericFalsy && allowEmptyFormatting) {
      value = '';
    }

    if (isNonNumericFalsy && !allowEmptyFormatting) return '';

    if (typeof value === 'number') {
      value = toNumericString(value);
      isNumericString = true;
    }

    if (value === 'Infinity' && isNumericString) {
      value = '';
    }

    if (isNumericString && !format && typeof decimalScale === 'number') {
      value = roundToPrecision(value, decimalScale, fixedDecimalScale);
    }

    const formattedValue = isNumericString ? this.formatNumString(value) : this.formatInput(value);

    return formattedValue;
  }

  formatNegation(value = '') {
    const { allowNegative } = this.props;
    const negationRegex = new RegExp('(-)');
    const doubleNegationRegex = new RegExp('(-)(.)*(-)');

    const hasNegation = negationRegex.test(value);

    const removeNegation = doubleNegationRegex.test(value);

    value = value.replace(/-/g, '');

    if (hasNegation && !removeNegation && allowNegative) {
      value = '-' + value;
    }

    return value;
  }

  formatInput(value = '') {
    const { format } = this.props;

    if (!format) {
      value = this.removePrefixAndSuffix(value);
      value = this.formatNegation(value);
    }

    value = this.removeFormatting(value);

    return this.formatNumString(value);
  }

  isCharacterAFormat(caretPos: number, value: string) {
    const { format, prefix, suffix, decimalScale, fixedDecimalScale } = this.props;
    const { decimalSeparator } = this.getSeparators();

    if (typeof format === 'string' && format[caretPos] !== '#') return true;

    if (
      !format &&
      (caretPos < prefix.length ||
        caretPos >= value.length - suffix.length ||
        (decimalScale && fixedDecimalScale && value[caretPos] === decimalSeparator))
    ) {
      return true;
    }

    return false;
  }

  checkIfFormatGotDeleted(start: number, end: number, value: string) {
    for (let i = start; i < end; i++) {
      if (this.isCharacterAFormat(i, value)) return true;
    }
    return false;
  }

  correctInputValue(caretPos: number, lastValue: string, value: string) {
    const { format, allowNegative, prefix, suffix, decimalScale } = this.props;
    const { allowedDecimalSeparators, decimalSeparator } = this.getSeparators();
    const lastNumStr = this.state.numAsString || '';
    const { selectionStart, selectionEnd } = this.selectionBeforeInput;
    const { start, end } = findChangedIndex(lastValue, value);

    if (
      !format &&
      start === end &&
      allowedDecimalSeparators.indexOf(value[selectionStart]) !== -1
    ) {
      const separator = decimalScale === 0 ? '' : decimalSeparator;
      return (
        value.substr(0, selectionStart) + separator + value.substr(selectionStart + 1, value.length)
      );
    }

    const leftBound = !!format ? 0 : prefix.length;
    const rightBound = lastValue.length - (!!format ? 0 : suffix.length);

    if (
      value.length > lastValue.length ||
      !value.length ||
      start === end ||
      (selectionStart === 0 && selectionEnd === lastValue.length) ||
      (start === 0 && end === lastValue.length) ||
      (selectionStart === leftBound && selectionEnd === rightBound)
    ) {
      return value;
    }

    if (this.checkIfFormatGotDeleted(start, end, lastValue)) {
      value = lastValue;
    }

    if (!format) {
      const numericString = this.removeFormatting(value);
      const { beforeDecimal, afterDecimal, addNegation } = splitDecimal(
        numericString,
        allowNegative,
      );

      const isBeforeDecimalPoint = caretPos < value.indexOf(decimalSeparator) + 1;
      if (
        numericString.length < lastNumStr.length &&
        isBeforeDecimalPoint &&
        beforeDecimal === '' &&
        !parseFloat(afterDecimal)
      ) {
        return addNegation ? '-' : '';
      }
    }

    return value;
  }

  updateValue(params: any) {
    const { formattedValue, input, setCaretPosition = true } = params;
    let { numAsString, caretPos } = params;
    const { onValueChange } = this.props;
    const { value: lastValue } = this.state;

    if (input) {
      if (setCaretPosition) {
        if (!caretPos) {
          const inputValue = params.inputValue || input.value;

          const currentCaretPosition = getCurrentCaretPosition(input);

          input.value = formattedValue;

          caretPos = this.getCaretPosition(inputValue, formattedValue, currentCaretPosition);
        }

        this.setPatchedCaretPosition(input, caretPos, formattedValue);
      } else {
        input.value = formattedValue;
      }
    }

    if (numAsString === undefined) {
      numAsString = this.removeFormatting(formattedValue);
    }

    if (formattedValue !== lastValue) {
      this.setState({ value: formattedValue, numAsString });

      onValueChange(this.getValueObject(formattedValue, numAsString));
    }
  }

  onChange(e: any) {
    const el = e.target;
    let inputValue = el.value;
    const { state, props } = this;
    const { isAllowed } = props;
    const lastValue = state.value || '';

    const currentCaretPosition = getCurrentCaretPosition(el);

    inputValue = this.correctInputValue(currentCaretPosition, lastValue, inputValue);

    let formattedValue = this.formatInput(inputValue) || '';
    const numAsString = this.removeFormatting(formattedValue);

    const valueObj = this.getValueObject(formattedValue, numAsString);
    const isChangeAllowed = isAllowed(valueObj);

    if (!isChangeAllowed) {
      formattedValue = lastValue;
    }

    this.updateValue({ formattedValue, numAsString, inputValue, input: el });

    if (isChangeAllowed) {
      props.onChange(e);
    }
  }

  onBlur(e: any) {
    const { props, state } = this;
    const { format, onBlur, allowLeadingZeros } = props;
    let { numAsString } = state as any;
    const lastValue = state.value;
    this.focusedElm = null;

    clearTimeout(this.focusTimeout);

    if (!format) {
      if (isNaN(parseFloat(numAsString))) {
        numAsString = '';
      }

      if (!allowLeadingZeros) {
        numAsString = fixLeadingZero(numAsString);
      }

      const formattedValue = this.formatNumString(numAsString);

      if (formattedValue !== lastValue) {
        this.updateValue({
          formattedValue,
          numAsString,
          input: e.target,
          setCaretPosition: false,
        });
        onBlur(e);
        return;
      }
    }
    onBlur(e);
  }

  onKeyDown(e: any) {
    const el = e.target;
    const { key } = e;
    const { selectionStart, selectionEnd, value = '' } = el;
    let expectedCaretPosition;
    const { decimalScale, fixedDecimalScale, prefix, suffix, format, onKeyDown } = this.props;
    const ignoreDecimalSeparator = decimalScale !== undefined && fixedDecimalScale;
    const numRegex = this.getNumberRegex(false, ignoreDecimalSeparator);
    const negativeRegex = new RegExp('-');
    const isPatternFormat = typeof format === 'string';

    this.selectionBeforeInput = {
      selectionStart,
      selectionEnd,
    };

    if (key === 'ArrowLeft' || key === 'Backspace') {
      expectedCaretPosition = selectionStart - 1;
    } else if (key === 'ArrowRight') {
      expectedCaretPosition = selectionStart + 1;
    } else if (key === 'Delete') {
      expectedCaretPosition = selectionStart;
    }

    if (expectedCaretPosition === undefined || selectionStart !== selectionEnd) {
      onKeyDown(e);
      return;
    }

    let newCaretPosition = expectedCaretPosition;
    const leftBound = isPatternFormat ? format.indexOf('#') : prefix.length;
    const rightBound = isPatternFormat ? format.lastIndexOf('#') + 1 : value.length - suffix.length;

    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      const direction = key === 'ArrowLeft' ? 'left' : 'right';
      newCaretPosition = this.correctCaretPosition(value, expectedCaretPosition, direction);
    } else if (
      key === 'Delete' &&
      !numRegex.test(value[expectedCaretPosition]) &&
      !negativeRegex.test(value[expectedCaretPosition])
    ) {
      while (!numRegex.test(value[newCaretPosition]) && newCaretPosition < rightBound)
        newCaretPosition++;
    } else if (key === 'Backspace' && !numRegex.test(value[expectedCaretPosition])) {
      if (selectionStart <= leftBound + 1 && value[0] === '-' && typeof format === 'undefined') {
        const newValue = value.substring(1);
        this.updateValue({
          formattedValue: newValue,
          caretPos: newCaretPosition,
          input: el,
        });
      } else if (!negativeRegex.test(value[expectedCaretPosition])) {
        while (!numRegex.test(value[newCaretPosition - 1]) && newCaretPosition > leftBound) {
          newCaretPosition--;
        }
        newCaretPosition = this.correctCaretPosition(value, newCaretPosition, 'left');
      }
    }

    if (
      newCaretPosition !== expectedCaretPosition ||
      expectedCaretPosition < leftBound ||
      expectedCaretPosition > rightBound
    ) {
      e.preventDefault();
      this.setPatchedCaretPosition(el, newCaretPosition, value);
    }

    if (e.isUnitTestRun) {
      this.setPatchedCaretPosition(el, newCaretPosition, value);
    }

    onKeyDown(e);
  }

  onMouseUp(e: any) {
    const el = e.target;

    const { selectionStart, selectionEnd, value = '' } = el;

    if (selectionStart === selectionEnd) {
      const caretPosition = this.correctCaretPosition(value, selectionStart);
      if (caretPosition !== selectionStart) {
        this.setPatchedCaretPosition(el, caretPosition, value);
      }
    }

    this.props.onMouseUp(e);
  }

  onFocus(e: any) {
    e.persist();

    this.focusedElm = e.target;
    this.focusTimeout = setTimeout(() => {
      const el = e.target;
      const { selectionStart, selectionEnd, value = '' } = el;

      const caretPosition = this.correctCaretPosition(value, selectionStart);

      if (
        caretPosition !== selectionStart &&
        !(selectionStart === 0 && selectionEnd === value.length)
      ) {
        this.setPatchedCaretPosition(el, caretPosition, value);
      }

      this.props.onFocus(e);
    }, 0);
  }

  render() {
    const {
      type,
      displayType,
      customInput,
      renderText,
      getInputRef,
      format,
      inputProps: otherInputProps,
    } = this.props;
    const { value, mounted } = this.state;

    const otherProps = omit(this.props, propTypes);

    const inputMode = mounted && addInputMode(format) ? 'numeric' : undefined;

    const inputProps = Object.assign({ inputMode }, otherProps, otherInputProps, {
      type,
      value,
      onChange: this.onChange,
      onKeyDown: this.onKeyDown,
      onMouseUp: this.onMouseUp,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
    });

    if (displayType === 'text') {
      return renderText ? (
        renderText(value, otherProps) || null
      ) : (
        <span {...otherProps} ref={getInputRef}>
          {value}
        </span>
      );
    } else if (customInput) {
      const CustomInput = customInput;
      return <CustomInput {...inputProps} ref={getInputRef} />;
    }

    return <input {...inputProps} ref={getInputRef} />;
  }
}

NumberWrapper.defaultProps = defaultProps;

export default NumberWrapper;
