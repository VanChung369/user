import { FC } from 'react';
import { FieldInputProps, FormikProps } from 'formik';
import _ from 'lodash';
import { Input } from 'antd';
import { LENGTH_CONSTANTS } from '@/constants';

const { TextArea } = Input;

const InputTextArea: FC<{
  field: FieldInputProps<any>;
  form: FormikProps<any>;
  maxLength?: number;
  props: any;
}> = ({ maxLength, field, form, ...props }) => {
  const maxLengthTextarea = maxLength || LENGTH_CONSTANTS.MAX_LENGTH_INPUT;

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
    <div className="text-area">
      <TextArea
        rows={5}
        maxLength={maxLengthTextarea}
        {...field}
        {...props}
        onChange={handleChange}
        onBlur={handleBlur}
        value={form.values[field.name]}
      />
    </div>
  );
};

export default InputTextArea;
