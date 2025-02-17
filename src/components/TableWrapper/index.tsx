import { TYPE_TABLE } from "@/constants/type";
import classNames from "classnames";
import { memo } from "react";
import style from "./index.module.scss";
import { TableWrapperProps } from "./typings";
import { Pagination, Table as TableAntd } from "antd";
import Table from "./components/Table";
import EditTable from "./components/EditableTable";
import SortTable from "./components/DragSortTable";
import TableList from "./components/TableList";

const TableWrapper = ({
  customComponent,
  totalPagination,
  typeTable,
  columns,
  dataSource,
  pageSizePagination,
  currentPagination,
  loading,
  onChangePagination,
  onChange,
  onChangeEditTable,
  rowSelection,
  rowKey,
  value,
  scroll,
  maxLength,
  recordCreatorProps,
  editableFormRef,
  controlled,
  headerTitle,
  actionRef,
  request,
  pagination,
  dragSortHandlerRender,
  dragSortKey,
  onDragSortEnd,
  metas,
  onRow,
  toolBarRender,
  emptyText,
  ...props
}: TableWrapperProps) => {
  let tableRender = customComponent;

  switch (typeTable) {
    case TYPE_TABLE.TABLE:
      tableRender = (
        <Table
          totalPagination={totalPagination}
          columns={columns}
          pagination={pagination}
          request={request}
          actionRef={actionRef}
          dataSource={dataSource}
          pageSizePagination={pageSizePagination}
          currentPagination={currentPagination}
          loading={loading}
          rowSelection={rowSelection}
          onChangePagination={onChangePagination}
          onChange={onChange}
          rowKey={rowKey}
          scroll={scroll}
          emptyText={emptyText}
          {...props}
        />
      );
      break;
    case TYPE_TABLE.EDIT_TABLE:
      tableRender = (
        <EditTable
          headerTitle={headerTitle}
          controlled={controlled}
          toolBarRender={toolBarRender}
          columns={columns}
          request={request}
          pagination={pagination}
          actionRef={actionRef}
          dataSource={dataSource}
          loading={loading}
          value={value}
          onChange={onChangeEditTable}
          rowKey={rowKey}
          scroll={scroll}
          maxLength={maxLength}
          recordCreatorProps={recordCreatorProps}
          editableFormRef={editableFormRef}
          {...props}
        />
      );
      break;
    case TYPE_TABLE.SORT_TABLE:
      tableRender = (
        <SortTable
          headerTitle={headerTitle}
          columns={columns}
          loading={loading}
          toolBarRender={toolBarRender}
          request={request}
          pagination={pagination}
          actionRef={actionRef}
          value={value}
          dataSource={dataSource}
          onChange={onChangeEditTable}
          rowKey={rowKey}
          scroll={scroll}
          maxLength={maxLength}
          recordCreatorProps={recordCreatorProps}
          editableFormRef={editableFormRef}
          dragSortHandlerRender={dragSortHandlerRender}
          dragSortKey={dragSortKey}
          onDragSortEnd={onDragSortEnd}
          {...props}
        />
      );
      break;
    case TYPE_TABLE.TABLE_LIST:
      tableRender = (
        <TableList
          headerTitle={headerTitle}
          columns={columns}
          loading={loading}
          request={request}
          toolBarRender={toolBarRender}
          pagination={pagination}
          actionRef={actionRef}
          value={value}
          dataSource={dataSource}
          metas={metas}
          rowSelection={rowSelection}
          rowKey={rowKey}
          scroll={scroll}
          onRow={onRow}
          {...props}
        />
      );
      break;
    default:
      tableRender = (
        <Table
          totalPagination={totalPagination}
          columns={columns}
          pagination={pagination}
          request={request}
          actionRef={actionRef}
          dataSource={dataSource}
          pageSizePagination={pageSizePagination}
          currentPagination={currentPagination}
          loading={loading}
          rowSelection={rowSelection}
          onChangePagination={onChangePagination}
          onChange={onChange}
          rowKey={rowKey}
          scroll={scroll}
          emptyText={emptyText}
          {...props}
        />
      );
      break;
  }

  return <div className={classNames(style.table)}>{tableRender}</div>;
};

export default memo(TableWrapper) as typeof TableWrapper;
