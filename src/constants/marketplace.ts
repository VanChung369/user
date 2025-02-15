export const MARKETPLACE_TABS = {
  NFTS: {
    key: "NFTS",
    label: "marketplace.nfts",
    type: "nfts",
  },
  COLLECTIONS: {
    key: "COLLECTIONS",
    label: "marketplace.collections",
    type: "collections",
  },
};

export const NFTS_SORTER = [
  {
    label: "marketplace.lowest.price",
    field: "unitPrice",
    order: "desc",
    value: 1,
  },
  {
    label: "marketplace.highest.price",
    field: "unitPrice",
    order: "asc",
    value: 2,
  },
  {
    label: "marketplace.new.arrivals",
    field: "createdAt",
    order: "desc",
    value: 3,
  },
];
