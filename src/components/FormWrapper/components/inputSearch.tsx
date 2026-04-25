import { FC } from 'react';
import { FieldInputProps, FormikProps } from 'formik';
import { LENGTH_CONSTANTS } from '@/constants';
import { Input } from 'antd';

const { Search } = Input;

const InputSearch: FC<{
  field: FieldInputProps<any>;
  form: FormikProps<any>;
  props: any;
}> = ({ field, form, ...props }) => {
  return <Search maxLength={LENGTH_CONSTANTS.MAX_LENGTH_INPUT} {...field} {...props} />;
};

export default InputSearch;
