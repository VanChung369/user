import { FC } from 'react';
import { FieldInputProps, FormikProps } from 'formik';
import _ from 'lodash';
import { Input, AutoComplete } from 'antd';

const InputAutoComplete: FC<{
  field: FieldInputProps<any>;
  form: FormikProps<any>;
  placeholder: string;
  onChange?: any;
  onBlur?: any;
  props: any;
}> = ({ field, form, placeholder, ...props }) => {
  const { onChange, onBlur } = props;

  const handleChange = (val: any) => {
    if (onChange) {
      onChange(val);
    } else {
      form.setFieldValue(field.name, val);
    }
  };

  const handleBlur = (e: any) => {
    const { value } = e.target;

    if (!onBlur) {
      form.handleBlur(e);
      form.setFieldValue(field.name, _.trim(value));
    } else {
      onBlur(e);
    }
  };

  return (
    <AutoComplete {...field} {...props} onChange={handleChange} onBlur={handleBlur} showArrow>
      <Input {...props} {...field} placeholder={placeholder} onBlur={handleBlur} />
    </AutoComplete>
  );
};

export default InputAutoComplete;
