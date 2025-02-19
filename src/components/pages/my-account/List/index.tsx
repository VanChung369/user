import { LENGTH_CONSTANTS } from "@/constants";
import React from "react";
import { TablePaginationConfig } from "antd";
import {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
} from "antd/lib/table/interface";
import { setOrderSorter } from "@/utils/sort";
import TableWrapper from "@/components/TableWrapper";
import { SorterTable } from "@/types";
import { useIntl } from "react-intl";
import style from "./index.module.scss";

type ListProps = {
  data?: Array<any>;
  loading?: boolean;
  total: number;
  params?: any;
  columns?: Array<any>;
  onSubmit: (values: any) => void;
};

const List = ({
  data,
  loading,
  total,
  params,
  columns,
  onSubmit,
}: ListProps) => {
  const intl = useIntl();
  const { limit, page } = params;

  const handleChangeTable = (
    _pagination: TablePaginationConfig,
    _filter: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
    _extra: TableCurrentDataSource<any>
  ) => {
    const { order, field } = sorter as SorterTable;
    const newOrder = setOrderSorter(order);

    onSubmit({
      ...params,
      field,
      order: newOrder,
      page: LENGTH_CONSTANTS.DEFAULT_PAGE,
    });
  };

  const handleChangePaging = (page: number, pageSize: number) => {
    onSubmit({
      ...params,
      page: pageSize !== limit ? LENGTH_CONSTANTS.DEFAULT_PAGE : page,
      limit: pageSize,
    });
  };

  return (
    <TableWrapper
      className={style.table_wrapper_list}
      classNamePagination={style.pagination_wrapper_list}
      simple={{ readOnly: true }}
      showSizeChanger={false}
      justify={"center"}
      total={total}
      columns={columns}
      loading={loading}
      dataSource={data}
      pageSize={limit}
      current={page}
      onChangePagination={handleChangePaging}
      rowKey={(row: any) => row?._id}
      onChange={handleChangeTable}
      isPagination={true}
      emptyText={intl.formatMessage({ id: "common.text.no.data" })}
    />
  );
};

export default List;
