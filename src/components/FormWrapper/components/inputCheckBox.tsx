import { FC } from 'react';
import { FieldInputProps, FormikProps } from 'formik';
import { Checkbox } from 'antd';

const InputCheckBox: FC<{
  field: FieldInputProps<any>;
  props: any;
  form: FormikProps<any>;
  content: any;
  checked?: boolean;
}> = ({ field, content, form, checked, ...props }) => (
  <Checkbox {...field} {...props} checked={checked ?? field.value}>
    {content}
  </Checkbox>
);

export default InputCheckBox;
