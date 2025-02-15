import { FC } from 'react';
import { FieldInputProps, FormikProps } from 'formik';
import { CheckCard } from '@ant-design/pro-components';

const InputCheckCardGroup: FC<{
  field: FieldInputProps<any>;
  props: any;
  form: FormikProps<any>;
  options: any;
  feildNameChange: any;
  onChangeValue: any;
  onChange: any;
}> = ({ field, form, options, onChange, ...props }) => {
  const handleChange = (value: any) => {
    if (!onChange) {
      form.setFieldValue(field.name, value);
    } else {
      onChange(value);
    }
  };
  return (
    <CheckCard.Group options={options} {...props} value={field.value} onChange={handleChange} />
  );
};

export default InputCheckCardGroup;
