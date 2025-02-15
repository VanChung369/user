import { FC, useEffect, useState } from "react";
import { FieldInputProps, FormikProps } from "formik";
import { LENGTH_CONSTANTS, TIME_CONSTANTS } from "@/constants";
import { Input } from "antd";
import useDebounce from "@/hooks/hook-customs/useDebounce";

const { Search } = Input;

const InputSearchDebounce: FC<{
  field: FieldInputProps<any>;
  form: FormikProps<any>;
  props: any;
  onSearch: any;
}> = ({ field, form, onSearch, ...props }) => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchVal = useDebounce(
    searchValue,
    TIME_CONSTANTS.DEBOUNCE_SEARCH_LIST
  );
  const onChange = (e: any) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearchVal);
    }
  }, [debouncedSearchVal]);

  useEffect(() => {
    setSearchValue(field?.value || null);
  }, [field?.value]);
  return (
    <Search
      maxLength={LENGTH_CONSTANTS.MAX_LENGTH_INPUT}
      {...field}
      value={searchValue}
      onChange={onChange}
      onSearch={onSearch}
      {...props}
    />
  );
};

export default InputSearchDebounce;
