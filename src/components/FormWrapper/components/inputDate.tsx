import { FC } from 'react';
import { FieldInputProps, FormikProps } from 'formik';
import { DatePicker, DatePickerProps } from 'antd';
import { DEFAULT_SEARCH_DATE_FORMAT } from '@/constants/input';
import { CalendarOutlined } from '@ant-design/icons';

const InputDate: FC<{
  field: FieldInputProps<any>;
  form: FormikProps<any>;
  props: any;
  onChange: any;
}> = ({ field, form, onChange, ...props }) => {
  const handleChange: DatePickerProps['onChange'] = (value: any) => {
    if (!onChange) {
      form.setFieldValue(field.name, value);
    } else {
      onChange(value);
    }
  };

  return (
    <DatePicker
      inputReadOnly
      format={DEFAULT_SEARCH_DATE_FORMAT}
      {...field}
      {...props}
      onChange={handleChange}
      suffixIcon={<CalendarOutlined />}
    />
  );
};

export default InputDate;
