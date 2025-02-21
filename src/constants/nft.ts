export const NFT_STATUS = [
  {
    name: "NFT.on.sale",
    value: "off-sale",
    color: "red",
  },
  {
    name: "NFT.off.sale",
    value: "on-sale",
    color: "green",
  },
  {
    name: "NFT.sold.out",
    value: "sold-out",
    color: "gold",
  },
];

export const NFT_ACTIVITIES_FIELDS = {
  KEYWORD: "keyword",
  FROM: "from",
  UNTIL: "until",
  PAGE: "page",
  LIMIT: "limit",
  SORT: "sort",
  QUANTITY: "quantity",
  TYPE: "tokenStandard",
};

export const NFT_LISTING_FIELD_SORTER = {
  REMAIN: "remain",
  DEFAULT: "default",
  UNIT_PRICE: "unitPrice",
  CREATED_AT: "createdAt",
};

export const NFT_ACTIVITIES_FIELD_SORTER = {
  HASH: "hash",
  TYPE: "type",
  DEFAULT: "default",
  QUANTITY: "quantity",
  CREATED_AT: "createdAt",
  TO_ADDRESS: "toAddress",
  FROM_ADDRESS: "fromAddress",
  UNIT_PRICE: "saleOrder.unitPrice",
  SUB_TOTAL: "subTotal",
  NFT_NAME: "nft.name",
  REVENUE: "revenue",
  PROFIT: "profit",
};

export const NFT_TRANSACTION_TYPE = {
  LISTED: "listed",
  DELISTED: "delisted",
  MINTED: "minted",
  TRANSFER: "transfer",
  ADMIN_MINTED: "admin-minted",
};

export const NFT_TRANSACTION_STATUS = {
  DRAFT: "draft",
  SUCCESS: "success",
  CANCEL: "cancel",
  FAILED: "failed",
};

export const BUY_STEPS = {
  START: 0,
  PROCESSING: 1,
  SUCCESSFUL: 2,
  FAILED: 3,
  CANCEL: 4,
};

export const LIST_FOR_SALE_STEPS = {
  START: 0,
  PROCESSING: 1,
  SUCCESSFUL: 2,
  FAILED: 3,
  CANCEL: 4,
};

export const REMOVE_FROM_SALE_STEPS = {
  START: 0,
  PROCESSING: 1,
  SUCCESSFUL: 2,
  FAILED: 3,
  CANCEL: 4,
};

export const BUY_FIELD = {
  QUANTITY: "quantity",
  SALE_ORDER_ID: "saleOrderId",
  TYPE: "type",
};

export const NFT_SALE_ORDER_TYPE = {
  SELL: "sell",
  RESELL: "resell",
};

export const NFT_STANDARD = [
  { value: "erc-721", key: 0, label: "NFT.management.ERC-721" },
  { value: "erc-1155", key: 1, label: "NFT.management.ERC-1155" },
];

export const LIST_FOR_SALE_FIELD = {
  QUANTITY: "quantity",
  UNIT_PRICE: "unitPrice",
  TOKEN_ID: "tokenId",
  CURRENCY: "currency",
  TYPE: "type",
};

export const NFT_DETAIL_TABS = {
  LISTING: {
    key: "LISTING",
    label: "NFT.detail.listing",
  },
  ACTIVITIES: {
    key: "ACTIVITIES",
    label: "NFT.detail.activities",
  },
  OWNED: {
    key: "OWNED",
    label: "NFT.detail.listing.owned",
  },
};

export const NFT_TRANSACTION_EVENT = [
  { value: "listed", label: "NFT.detail.listed" },
  { value: "delisted", label: "NFT.detail.delisted" },
  { value: "minted", label: "NFT.detail.bought" },
  { value: "transfer", label: "NFT.detail.bought" },
];
