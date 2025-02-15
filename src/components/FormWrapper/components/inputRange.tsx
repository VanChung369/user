import { FC } from 'react';
import { FieldInputProps, FormikProps } from 'formik';
import _ from 'lodash';
import { Slider } from 'antd';

const InputRange: FC<{
  field: FieldInputProps<any>;
  form: FormikProps<any>;
  props: any;
  onChange?: any;
}> = ({ field, form, ...props }) => {
  const { onChange } = props;

  const handleChange = (val: any) => {
    if (onChange) {
      onChange(val);
    } else {
      form.setFieldValue(field.name, val);
    }
  };

  return <Slider {...field} onChange={handleChange} {...props} />;
};

export default InputRange;
