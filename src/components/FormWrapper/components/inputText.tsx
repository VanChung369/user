import { FC } from 'react';
import { FieldInputProps, FormikProps } from 'formik';
import _ from 'lodash';
import { Input } from 'antd';
import { LENGTH_CONSTANTS } from '@/constants';

const InputText: FC<{
  field: FieldInputProps<any>;
  form: FormikProps<any>;
  props: any;
  onChange?: any;
  onBlur?: any;
}> = ({ field, form, ...props }) => {
  const { onChange, onBlur } = props as any;
  const handleChange = (e: any) => {
    const { value } = e.target;

    if (!onChange) {
      form.setFieldValue(field.name, value);
    } else {
      onChange(e);
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
    <Input
      {...props}
      {...field}
      maxLength={LENGTH_CONSTANTS.MAX_LENGTH_INPUT}
      onChange={handleChange}
      onBlur={handleBlur}
      value={form.values[field.name]}
    />
  );
};

export default InputText;
