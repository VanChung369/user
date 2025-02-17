export type TableWrapperProps = {
  columns?: Array<any>;
  dataSource?: readonly any[];
  current?: number;
  pageSize?: number;
  total: number;
  rowClassName?: string;
  pageSizeOptions?: string[];
  onChangeTable?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
    extra: TableCurrentDataSource<any>,
  ) => void;
  onChangePagination?: (page: number, pageSize: number) => void;
  size?: SizeType;
  bordered?: boolean;
  rowKey?: string | GetRowKey<any>;
  className?: string;
  scroll?: any;
  loading?: boolean;
  showTotal?: boolean;
  showSizeChanger?: boolean;
  showPagination?: boolean;
  emptyText?: string;
  locale?: any;
  [key: string]: any;
};
