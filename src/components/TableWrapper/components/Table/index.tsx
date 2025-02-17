import { TABLE } from "@/constants/table";
import {
  ActionType,
  ProColumns,
  RequestData,
} from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-table";
import { SearchConfig } from "@ant-design/pro-table/es/components/Form/FormRender";
import {
  Pagination,
  Row,
  SpinProps,
  TablePaginationConfig,
  TooltipProps,
} from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { PaginationConfig } from "antd/es/pagination";
import {
  FilterValue,
  SorterResult,
  SortOrder,
  TableCurrentDataSource,
  TableLocale,
  TableRowSelection,
} from "antd/es/table/interface";
import classNames from "classnames";
import { GetRowKey } from "rc-table/es/interface";
import { Fragment, ReactNode, Ref } from "react";
import styles from "./index.module.scss";
import { Empty } from "antd";

type TableProps = {
  headerTitle?: string | ReactNode;
  actionRef?: Ref<ActionType | undefined>;
  rowKey?: string | GetRowKey<any>;
  search?: false | SearchConfig;
  toolBarRender?:
    | false
    | ((
        action: ActionType | undefined,
        rows: {
          selectedRowKeys?: (string | number)[] | undefined;
          selectedRows?: any | undefined;
        }
      ) => ReactNode[]);
  request?: (
    params: {
      pageSize?: number;
      current?: number;
      keyword?: string;
    },
    sort: Record<string, SortOrder>,
    filter: Record<string, (string | number)[] | null>
  ) => Promise<Partial<RequestData<any>>>;
  columns?: ProColumns<any, any>[];
  rowSelection?: false | TableRowSelection<any>;
  className?: string;
  scroll?: any;
  bordered?: boolean;
  pagination?:
    | false
    | (false & PaginationConfig)
    | (TablePaginationConfig & false)
    | (TablePaginationConfig & PaginationConfig);
  dataSource?: any;
  loading?: boolean | SpinProps;
  rowClassName?: string;
  size?: SizeType;
  showSorterTooltip?: boolean | TooltipProps;
  onChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
    extra: TableCurrentDataSource<any>
  ) => void;
  isPagination?: boolean;
  sizePagination?: "small" | "default";
  totalPagination?: number;
  currentPagination?: number;
  onChangePagination?: (page: number, pageSize: number) => void;
  pageSizeOptions?: string[];
  pageSizePagination?: number;
  classNamePagination?: string;
  emptyText?: string;
  locale?: TableLocale;
  justify?:
    | "center"
    | "end"
    | "start"
    | "space-around"
    | "space-between"
    | "space-evenly";

  [key: string]: any;
};

const Table = <T extends Record<string, any>, D extends Record<string, any>>({
  headerTitle,
  actionRef,
  rowKey,
  search = false,
  toolBarRender = false,
  request,
  columns,
  rowSelection = false,
  className,
  scroll,
  bordered,
  pagination = false,
  dataSource,
  loading,
  rowClassName,
  size,
  showSorterTooltip = false,
  onChange,
  isPagination,
  sizePagination = "default",
  totalPagination = TABLE.TOTAL_PAGINATION,
  currentPagination = TABLE.CURRENT_PAGINATION,
  onChangePagination,
  pageSizeOptions = TABLE.PAGE_SIZE_OPTION,
  pageSizePagination = TABLE.PAGE_SIZE_PAGINATION,
  classNamePagination,
  justify = "end",
  emptyText,
  locale,
  ...props
}: TableProps) => {
  return (
    <Fragment>
      <ProTable
        locale={{
          emptyText: (
            <Empty
              description={emptyText}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
        headerTitle={headerTitle}
        actionRef={actionRef}
        search={search}
        rowKey={rowKey}
        toolBarRender={toolBarRender}
        request={request}
        columns={columns}
        pagination={pagination}
        rowSelection={rowSelection}
        dataSource={dataSource}
        className={classNames(styles.table, className)}
        scroll={scroll || { x: 960 }}
        bordered={bordered}
        loading={loading}
        rowClassName={rowClassName}
        showSorterTooltip={showSorterTooltip}
        size={size}
        onChange={onChange}
        {...props}
      />

      {isPagination && (
        <Row justify={justify}>
          <Pagination
            className={classNames(styles.pagination, classNamePagination)}
            size={sizePagination}
            total={totalPagination}
            current={currentPagination}
            onChange={onChangePagination}
            pageSizeOptions={pageSizeOptions}
            pageSize={pageSizePagination}
            showSizeChanger
            {...props}
          />
        </Row>
      )}
    </Fragment>
  );
};

export default Table;
