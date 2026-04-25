import { FC, Fragment, useEffect, useState } from "react";
import { FieldConfig, FieldInputProps, FormikProps } from "formik";
import { TYPE_INPUT } from "@/constants/input";
import { Select, Checkbox, Empty } from "antd";
import { useIntl } from "react-intl";

const { Option } = Select;
const InputSelect: FC<{
  field: FieldInputProps<any>;
  props: FieldConfig;
  form: FormikProps<any>;
  options: {
    value: any;
    name: any;
  }[];
  prefix?: any;
  className?: string;
  onChange?: any;
  mode?: any;
  values?: any;
  optionsType?: any;
  enableAllOption?: any;
  placeholder?: string;
  renderOption?: any;
  textSelectAll?: any;
}> = ({
  field,
  form,
  options = [],
  prefix,
  className,
  onChange,
  optionsType,
  enableAllOption,
  placeholder,
  renderOption,
  textSelectAll,
  ...props
}) => {
  const intl = useIntl();

  const ALL_OPTIONS = "all-options";
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const { value } = field;

  useEffect(() => {
    setIndeterminate(
      !!value && !!value.length && value.length < options.length
    );
    setCheckAll(!!value && !!value.length && value.length === options.length);
  }, [value]);

  const onCheckAllOptions = (event: any) => {
    const { checked } = event.target;
    let values = [];
    if (checked) {
      values = options.map((option) => option.value);
    } else {
      values = [];
    }
    setIndeterminate(false);
    setCheckAll(checked);
    onChangeSelect(values);
  };

  const optionsSelectAllRender = () => {
    switch (optionsType) {
      case TYPE_INPUT.CHECKBOX: {
        return (
          <Checkbox
            onChange={onCheckAllOptions}
            id={ALL_OPTIONS}
            indeterminate={indeterminate}
            checked={checkAll}
          >
            {textSelectAll ??
              intl.formatMessage({
                id: "common.text.all",
              })}
          </Checkbox>
        );
      }
      default: {
        return null;
      }
    }
  };

  const optionsRender = (item: any) => {
    switch (optionsType) {
      case TYPE_INPUT.CHECKBOX: {
        return (
          <Checkbox
            id={item.value}
            checked={value && value.indexOf(item.value) >= 0}
          >
            <div onClick={onPreventMouseDown}>{item.name}</div>
          </Checkbox>
        );
      }
      default: {
        return item.name;
      }
    }
  };

  const onPreventMouseDown = (event: any) => {
    event.stopPropagation();
  };

  const onChangeSelect = (val: any) => {
    if (onChange) {
      onChange(val);
    }
    form.setFieldValue(field.name, val);
  };

  return (
    <div className={className}>
      {prefix}
      <Select
        {...field}
        {...props}
        placeholder={placeholder}
        onChange={onChangeSelect}
        notFoundContent={
          <div className="ant-empty-text">
            <Empty />
            <p>
              {intl.formatMessage({
                id: "common.text.nodata",
              })}
            </p>
          </div>
        }
        dropdownRender={(menu) => {
          return (
            <Fragment>
              {enableAllOption &&
                options.length > 1 &&
                optionsSelectAllRender()}
              {menu}
            </Fragment>
          );
        }}
      >
        {renderOption
          ? options.map((item, index) => renderOption({ item, index }))
          : options.map((item: any) => (
              <Option
                value={item.value}
                key={item?.key || item.value}
                label={item.name}
              >
                {optionsRender(item)}
              </Option>
            ))}
      </Select>
    </div>
  );
};

export default InputSelect;
