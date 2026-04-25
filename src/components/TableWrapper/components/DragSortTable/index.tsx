import type { ActionType, EditableFormInstance, ProColumns } from '@ant-design/pro-components';
import { DragSortTable } from '@ant-design/pro-components';
import { SearchConfig } from '@ant-design/pro-table/es/components/Form/FormRender';
import { SpinProps, TablePaginationConfig } from 'antd';
import { PaginationConfig } from 'antd/es/pagination';
import { SortOrder } from 'antd/es/table/interface';
import classNames from 'classnames';
import { GetRowKey } from 'rc-table/es/interface';
import { Fragment, ReactNode, Ref } from 'react';

type DragSortTableProps = {
  headerTitle?: string | ReactNode;
  editableFormRef?: Ref<EditableFormInstance>;
  rowKey?: string | GetRowKey<any>;
  dragSortKey?: string;
  pagination?:
    | false
    | (false & PaginationConfig)
    | (TablePaginationConfig & false)
    | (TablePaginationConfig & PaginationConfig);
  request?: (
    params: {
      pageSize?: number;
      current?: number;
      keyword?: string;
    },
    sort: Record<string, SortOrder>,
    filter: Record<string, (string | number)[] | null>,
  ) => Promise<any>;

  toolBarRender?:
    | false
    | ((
        action: ActionType | undefined,
        rows: { selectedRowKeys?: (string | number)[] | undefined; selectedRows?: any | undefined },
      ) => ReactNode[]);
  columns?: ProColumns<any, any>[];
  className?: string;
  scroll?: any;
  loading?: boolean | SpinProps;
  dataSource?: any;
  onDragSortEnd?: (newDataSource: any) => void | Promise<void>;
  search?: false | SearchConfig;
  dragSortHandlerRender?: (rowData: any, idx: number) => ReactNode;
  actionRef?: Ref<ActionType>;

  [key: string]: any;
};

const SortTable = ({
  headerTitle,
  rowKey,
  dataSource,
  scroll,
  loading,
  dragSortKey,
  columns,
  request,
  onDragSortEnd,
  className,
  pagination = false,
  search = false,
  dragSortHandlerRender,
  actionRef,
  toolBarRender = false,
  ...props
}: DragSortTableProps) => {
  return (
    <Fragment>
      <DragSortTable
        className={classNames(className)}
        headerTitle={headerTitle}
        toolBarRender={toolBarRender}
        dataSource={dataSource}
        columns={columns}
        request={request}
        actionRef={actionRef}
        pagination={pagination}
        scroll={scroll || { x: 960 }}
        search={search}
        rowKey={rowKey}
        loading={loading}
        dragSortHandlerRender={dragSortHandlerRender}
        dragSortKey={dragSortKey}
        onDragSortEnd={onDragSortEnd}
        {...props}
      />
    </Fragment>
  );
};

export default SortTable;
