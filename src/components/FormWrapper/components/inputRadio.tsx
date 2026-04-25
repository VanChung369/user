import { FC } from 'react';
import { FieldInputProps, FormikProps } from 'formik';
import { Radio } from 'antd';

const InputRadio: FC<{
  field: FieldInputProps<any>;
  props: any;
  form: FormikProps<any>;
  options: {
    value: any;
    name: any;
  }[];
}> = ({ field, form, options, ...props }) => {
  const { onChange } = props as any;
  const handleChange = (e: any) => {
    if (!onChange) {
      form.setFieldValue(field.name, e.target.value);
    } else {
      onChange(e);
    }
  };

  return (
    <Radio.Group onChange={handleChange} value={field.value}>
      {options.map((e: { value: any; name: any }) => (
        <Radio key={e.value} value={e.value}>
          {e.name}
        </Radio>
      ))}
    </Radio.Group>
  );
};

export default InputRadio;
