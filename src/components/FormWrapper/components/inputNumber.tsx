import { FC, Fragment } from 'react';
import { FieldInputProps, FormikProps } from 'formik';
import NumberWrapper from '@/components/NumberWrapper';
import { Input } from 'antd';

const InputNumber: FC<{
  field: FieldInputProps<any>;
  props: any;
  form: FormikProps<any>;
  unit: string;
  thousandSeparator?: boolean;
  onChange?: any;
  onValueChange?: any;
}> = ({ field, form, unit, thousandSeparator, onChange, onValueChange, ...props }) => {
  const handleChange = (e: React.ChangeEvent<any>) => {
    if (thousandSeparator) {
      return;
    } else {
      field.onChange(e);
    }
  };

  const handleValueChange = (values: any) => {
    if (thousandSeparator) {
      form.setFieldValue(field.name, values?.value);
    }
  };

  return (
    <Fragment>
      <NumberWrapper
        allowNegative={false}
        customInput={Input}
        thousandSeparator={thousandSeparator}
        onValueChange={onValueChange ?? handleValueChange}
        {...field}
        {...props}
        onChange={onChange ?? handleChange}
      />
      {unit && <span>{unit}</span>}
    </Fragment>
  );
};

export default InputNumber;
