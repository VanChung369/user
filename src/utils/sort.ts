export const ANTD_ORDERS = {
  ASCEND: 'ascend',
  DESCEND: 'descend',
};

export const ORDERS = {
  ASC: 'asc',
  DESC: 'desc',
  FIELD: 'field',
  ORDER: 'order',
};

export const setOrderSorter = (order: string | null | undefined) => {
  const newOrder =
    (order === ANTD_ORDERS.ASCEND && ORDERS.ASC) ||
    (order === ANTD_ORDERS.DESCEND && ORDERS.DESC) ||
    null;
  return newOrder;
};

export const getRowKey = (row: any) => row?._id;
