import type {
  ActionType,
  ProColumns,
  ProListMetas,
  RequestData,
  RowEditableConfig,
} from '@ant-design/pro-components';
import { ProList } from '@ant-design/pro-components';
import { SpinProps, TablePaginationConfig } from 'antd';
import { LabelTooltipType } from 'antd/es/form/FormItemLabel';
import { PaginationConfig } from 'antd/es/pagination';
import { ExpandableConfig, SortOrder, TableRowSelection } from 'antd/es/table/interface';
import { GetComponentProps, GetRowKey } from 'rc-table/es/interface';
import { Fragment, ReactNode, Ref } from 'react';

type TableListProps = {
  headerTitle?: string | ReactNode;
  rowKey?: string | GetRowKey<any>;
  request?: (
    params: {
      pageSize?: number;
      current?: number;
      keyword?: string;
    },
    sort: Record<string, SortOrder>,
    filter: Record<string, (string | number)[] | null>,
  ) => Promise<Partial<RequestData<any>>>;
  onRow?: GetComponentProps<any>;
  toolBarRender?:
    | false
    | ((
        action: ActionType | undefined,
        rows: {
          selectedRowKeys?: (string | number)[] | undefined;
          selectedRows?: any[] | undefined;
        },
      ) => ReactNode[]);
  columns?: ProColumns<any, any>[];
  rowSelection?: false | TableRowSelection<any>;
  editable?: RowEditableConfig<any>;
  className?: string;
  scroll?: any;
  tooltip?: LabelTooltipType;
  loading?: boolean | SpinProps;
  actionRef?: Ref<ActionType>;
  dataSource?: any;
  showActions?: 'hover' | 'always';
  showExtra?: 'hover' | 'always';
  metas?: ProListMetas<any>;

  itemLayout?: 'horizontal' | 'vertical';
  pagination?:
    | false
    | (false & PaginationConfig)
    | (TablePaginationConfig & false)
    | (TablePaginationConfig & PaginationConfig);
  expandable?: ExpandableConfig<any>;
  [key: string]: any;
};

const TableList = ({
  headerTitle,
  rowKey,
  scroll,
  loading,
  columns,
  request,
  editable,
  className,
  actionRef,
  tooltip,
  dataSource,
  toolBarRender = false,
  expandable,
  onRow,
  rowSelection = false,
  pagination,
  showActions,
  showExtra,
  itemLayout,
  metas,
  ...props
}: TableListProps) => {
  return (
    <Fragment>
      <ProList
        className={className}
        headerTitle={headerTitle}
        tooltip={tooltip}
        expandable={expandable}
        dataSource={dataSource}
        showActions={showActions}
        showExtra={showExtra}
        pagination={pagination}
        toolBarRender={toolBarRender}
        columns={columns}
        actionRef={actionRef}
        request={request}
        onRow={onRow}
        scroll={scroll || { x: 960 }}
        rowKey={rowKey}
        itemLayout={itemLayout}
        editable={editable}
        metas={metas}
        loading={loading}
        rowSelection={rowSelection}
        {...props}
      />
    </Fragment>
  );
};

export default TableList;
