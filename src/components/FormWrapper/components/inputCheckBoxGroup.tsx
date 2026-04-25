import { FC } from 'react';
import { FieldInputProps, FormikProps } from 'formik';
import { Checkbox } from 'antd';

const CheckBoxGroup = Checkbox.Group;

const InputCheckBoxGroup: FC<{
  field: FieldInputProps<any>;
  props: any;
  form: FormikProps<any>;
  options: any;
  feildNameChange: any;
  onChangeValue: any;
  onChange: any;
}> = ({ field, form, options, onChange, ...props }) => {
  const handleChange = (value: any) => {
    if (onChange) {
      onChange(value);
    } else {
      if (field.value.includes(value)) {
      } else {
        form.setFieldValue(field.name, [...value]);
        form.setFieldValue(props?.feildNameChange, props?.onChangeValue);
      }
    }
  };

  return (
    <CheckBoxGroup
      options={options.map((e: any) => ({ ...e, label: e.name }))}
      value={field.value}
      {...props}
      onChange={handleChange}
    />
  );
};

export default InputCheckBoxGroup;
