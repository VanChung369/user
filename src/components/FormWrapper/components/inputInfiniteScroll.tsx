import React, { useState, FC, useEffect, useMemo } from "react";
import { FieldInputProps, FormikProps } from "formik";
import { Select } from "antd";
import { useInfiniteQuery } from "@tanstack/react-query";
import { uniqBy } from "lodash";
import HTTP_STATUS_CONTSTANTS from "@/constants/status";
import { LENGTH_CONSTANTS } from "@/constants";
import { useIntl } from "react-intl";

const { Option } = Select;

const InfinityScrollSelect: FC<{
  fetchData: (query: any) => Promise<any>;
  renderOption?: any;
  limit?: number;
  value?: any;
  field?: FieldInputProps<any>;
  props?: any;
  form?: FormikProps<any>;
  className?: string;
  onChange?: any;
  setIsSearch?: any;
  emptyText?: string;
  mode?: any;
  queryKey?: string[];
}> = ({
  fetchData,
  renderOption: renderOptionProps,
  limit = 10,
  value: valueProps,
  field,
  form,
  className,
  onChange,
  setIsSearch,
  emptyText,
  mode,
  queryKey = ["infinityScrollSelect"],
  ...props
}) => {
  const intl = useIntl();
  const [searchValue, setSearchValue] = useState("");
  const [value, setValue] = useState(valueProps);

  useEffect(() => {
    setValue(field?.value || null);
  }, [field?.value]);

  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: [...queryKey, searchValue],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetchData({
        limit,
        offset: pageParam,
        searchValue,
      });

      return res;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.nextPage) {
        return lastPage.nextPage;
      }
      return undefined;
    },
  });

  const dataShow = uniqBy(
    data?.pages.flatMap((page) => page?.docs) || [],
    "_id"
  );
  const total = data?.pages[0]?.totalDocs || 0;

  useEffect(() => {
    refetch();
  }, [searchValue, refetch]);

  const onSearch = (value: any) => {
    setIsSearch && setIsSearch(true);
    if (value?.length > LENGTH_CONSTANTS.MAX_LENGTH_INPUT) {
      return;
    }
    setSearchValue(value);
  };

  const handleScroll = (e: any) => {
    const target = e.target;
    const clientHeight = target.clientHeight;
    const scrollHeight = target.scrollHeight;
    const scrollTop = target.scrollTop;
    const isNearTheBottom = clientHeight + scrollTop >= (3 / 5) * scrollHeight;
    if (total && dataShow.length >= total) {
      return;
    }
    if (isNearTheBottom && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderOption = ({ item, index }: { item: any; index: number }) => {
    if (renderOptionProps) {
      return renderOptionProps({ item, index });
    }
    return (
      <Option key={item._id} value={item._id} name={item.name}>
        {item.name}
      </Option>
    );
  };

  const handleChange = (selectValue: any) => {
    if (!onChange) {
      if (field?.name && form) {
        form.setFieldValue(
          field.name,
          dataShow.find((item: any) => item._id === selectValue)
        );
      } else {
        setValue(selectValue);
      }
    } else {
      if (mode == "multiple") {
        let filteredArray = selectValue.filter((item: any) => item !== null);
        onChange({
          item: filteredArray,
          form,
          field,
        });
      } else {
        onChange({
          item: dataShow.find((item: any) => item._id === selectValue),
          form,
          field,
        });
      }
    }
  };

  return (
    <div className={className}>
      <Select
        {...field}
        mode={mode}
        onPopupScroll={handleScroll}
        showSearch
        filterOption={true}
        onSearch={onSearch}
        searchValue={searchValue}
        value={value?._id || value}
        onChange={handleChange}
        optionLabelProp="name"
        optionFilterProp="name"
        maxTagCount="responsive"
        {...props}
      >
        {dataShow?.map((item: any, index: any) =>
          renderOption({ item, index })
        )}
      </Select>
    </div>
  );
};

export default InfinityScrollSelect;
