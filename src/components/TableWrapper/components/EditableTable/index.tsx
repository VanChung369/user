import type {
  ActionType,
  EditableFormInstance,
  ProColumns,
  RequestData,
  RowEditableConfig,
} from '@ant-design/pro-components';
import { EditableProTable } from '@ant-design/pro-components';
import { RecordCreatorProps } from '@ant-design/pro-table/es/components/EditableTable';
import { ButtonProps, SpinProps, TablePaginationConfig } from 'antd';
import { PaginationConfig } from 'antd/es/pagination';
import { SortOrder, TableRowSelection } from 'antd/es/table/interface';
import { GetRowKey } from 'rc-table/es/interface';
import { Fragment, ReactNode, Ref } from 'react';

type EditTableProps = {
  headerTitle?: string | ReactNode;
  editableFormRef?: Ref<EditableFormInstance>;
  rowKey?: string | GetRowKey<any>;
  recordCreatorProps?:
    | (RecordCreatorProps<any> &
        ButtonProps & {
          creatorButtonText?: ReactNode;
        })
    | false;
  toolBarRender?:
    | false
    | ((
        action: ActionType | undefined,
        rows: { selectedRowKeys?: (string | number)[] | undefined; selectedRows?: any | undefined },
      ) => ReactNode[]);
  maxLength?: number;
  value?: any;
  request?: (
    params: {
      pageSize?: number;
      current?: number;
      keyword?: string;
    },
    sort: Record<string, SortOrder>,
    filter: Record<string, (string | number)[] | null>,
  ) => Promise<Partial<RequestData<any>>>;
  columns?: ProColumns<any, any>[];
  rowSelection?: false | TableRowSelection<any>;
  editable?: RowEditableConfig<any>;
  className?: string;
  scroll?: any;
  pagination?:
    | false
    | (false & PaginationConfig)
    | (TablePaginationConfig & false)
    | (TablePaginationConfig & PaginationConfig);
  loading?: boolean | SpinProps;
  controlled?: boolean;
  onChange?: (value: any) => void;
  actionRef?: Ref<ActionType>;
  dataSource?: any;
  [key: string]: any;
};

const EditTable = <T extends Record<string, any>, D extends Record<string, any>>({
  headerTitle,
  rowKey,
  maxLength,
  scroll,
  loading,
  recordCreatorProps,
  columns,
  request,
  onChange,
  editable,
  value,
  className,
  controlled,
  editableFormRef,
  actionRef,
  pagination = false,
  dataSource,
  toolBarRender = false,
  ...props
}: EditTableProps) => {
  return (
    <Fragment>
      <EditableProTable
        editableFormRef={editableFormRef}
        controlled={controlled}
        toolBarRender={toolBarRender}
        className={className}
        headerTitle={headerTitle}
        maxLength={maxLength}
        columns={columns}
        actionRef={actionRef}
        request={request}
        value={value}
        dataSource={dataSource}
        onChange={onChange}
        scroll={scroll || { x: 960 }}
        recordCreatorProps={recordCreatorProps}
        rowKey={rowKey}
        pagination={pagination}
        editable={editable}
        loading={loading}
        {...props}
      />
    </Fragment>
  );
};

export default EditTable;
