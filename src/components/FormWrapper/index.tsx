import React, { memo, FC } from "react";
import { Field, ErrorMessage } from "formik";
import { Tooltip } from "antd";
import { TYPE_INPUT } from "@/constants/input";
import { FormkWrapperProps } from "./typings";
import cx from "classnames";
import _ from "lodash";
import styleLess from "./index.module.scss";
import { QuestionCircleOutlined } from "@ant-design/icons";
import InputText from "./components/inputText";
import InputTextArea from "./components/inputTextArea";
import InputDate from "./components/inputDate";
import InputPassword from "./components/inputPassword";
import InputSelect from "./components/inputSelect";
import InputCheckBox from "./components/inputCheckBox";
import InputCheckBoxGroup from "./components/inputCheckBoxGroup";
import InputNumber from "./components/inputNumber";
import InputSearch from "./components/inputSearch";
import InputSwitch from "./components/inputSwitch";
import InputRadio from "./components/inputRadio";
import InputAutoComplete from "./components/inputAutoComplete";
import InputRange from "./components/inputRange";
import InputSearchDebounce from "./components/inputSearchDebounce";
import InputCheckCardGroup from "./components/inputCheckCardGroup";
import InfinityScrollSelect from "./components/inputInfiniteScroll";

const FormWrapper: FC<FormkWrapperProps> = ({
  customComponent,
  placeholder,
  type,
  name,
  typeInput = TYPE_INPUT.TEXT,
  prefix,
  dropdownClassName,
  className,
  content,
  label,
  labelClassName,
  containerClassName,
  errorClassName,
  required,
  children,
  errorField,
  description,
  disabled,
  unit,
  validate,
  labelTootip,
  subLabel,
  appendInput = null,
  textTooltip,
  helpText,
  suffix,
  helpTextClassName,
  ...props
}) => {
  let inputRender = customComponent;

  switch (typeInput) {
    case TYPE_INPUT.TEXT:
      inputRender = InputText;
      break;
    case TYPE_INPUT.TEXTAREA:
      inputRender = InputTextArea;
      break;
    case TYPE_INPUT.DATE:
      inputRender = InputDate;
      break;
    case TYPE_INPUT.PASSWORD:
      inputRender = InputPassword;
      break;
    case TYPE_INPUT.SELECT:
      inputRender = InputSelect;
      break;
    case TYPE_INPUT.CHECKBOX:
      inputRender = InputCheckBox;
      break;
    case TYPE_INPUT.CHECKBOXGROUP:
      inputRender = InputCheckBoxGroup;
      break;
    case TYPE_INPUT.NUMBER:
      inputRender = InputNumber;
      break;
    case TYPE_INPUT.SEARCH:
      inputRender = InputSearch;
      break;
    case TYPE_INPUT.SWITCH:
      inputRender = InputSwitch;
      break;
    case TYPE_INPUT.RADIO:
      inputRender = InputRadio;
      break;
    case TYPE_INPUT.AUTOCOMPLETE:
      inputRender = InputAutoComplete;
      break;
    case TYPE_INPUT.RANGE:
      inputRender = InputRange;
      break;
    case TYPE_INPUT.SEARCH_DEBOUNCE:
      inputRender = InputSearchDebounce;
      break;
    case TYPE_INPUT.CHECK_CARD_GROUP:
      inputRender = InputCheckCardGroup;
      break;
    case TYPE_INPUT.SELECT_INFINITY_SCROLL:
      inputRender = InfinityScrollSelect;
      break;
  }

  const propsField: any = {
    prefix,
    placeholder,
    className,
    content,
    disabled,
    ...props,
  };

  return (
    <div className={cx(containerClassName, styleLess.form)}>
      {label && (
        <div className={cx(labelClassName, styleLess.form__label)}>
          {label}&nbsp;{required ? "*" : ""}&nbsp;
          {labelTootip && (
            <Tooltip
              trigger="hover"
              title={labelTootip}
              overlayClassName="tooltip-detail"
            >
              <span>
                <QuestionCircleOutlined />
              </span>
            </Tooltip>
          )}
          {helpText && (
            <span className={cx(helpTextClassName, "ml-auto")}>{helpText}</span>
          )}
        </div>
      )}
      {subLabel && <p className={styleLess.form__text_red}>{subLabel}</p>}
      {description && (
        <div className={cx(labelClassName, styleLess.form__description)}>
          {description}
        </div>
      )}
      <div className={styleLess.form__field}>
        <Field
          type={type}
          name={name}
          placeholder={placeholder}
          label={label}
          component={inputRender}
          unit={unit}
          validate={validate}
          {...propsField}
        />
        {textTooltip && (
          <Tooltip
            trigger="hover"
            title={textTooltip}
            overlayClassName="tooltip-detail"
          >
            <span>
              <QuestionCircleOutlined />
            </span>
          </Tooltip>
        )}
        {appendInput}
      </div>
      <ErrorMessage
        name={errorField || name}
        component="div"
        className={cx(styleLess.form__error, errorClassName)}
      />
      {children}
    </div>
  );
};

export default memo(FormWrapper);
