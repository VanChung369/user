import { FC } from 'react';
import { FieldInputProps, FormikProps } from 'formik';
import { Switch } from 'antd';

const InputSwitch: FC<{
  field: FieldInputProps<any>;
  props: any;
  form: FormikProps<any>;
  onChange: any;
}> = ({ field, form, onChange, ...props }) => {
  const handleSwitchChange = (checked: boolean) => {
    if (onChange) {
      onChange(checked);
    }
    form.setFieldValue(field.name, checked);
  };
  return <Switch {...field} {...props} checked={!!field.value} onChange={handleSwitchChange} />;
};

export default InputSwitch;
