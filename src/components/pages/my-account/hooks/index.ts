import { useAppSelector } from "@/hooks";
import selectedAddress from "@/redux/address/selector";
import { getNfts } from "@/services/api/nft";
import { useQuery } from "@tanstack/react-query";
import { get, omit, pick } from "lodash";
import { useGetNFTSize } from "@/hooks/hook-customs/useGetNFTSize";
import { ORDERS } from "@/constants";
import { NFTS_SORTER } from "@/constants/marketplace";
import { KEY_SEARCH } from "../NFTs";
import {
  NFT_ACTIVITIES_FIELD_SORTER,
  NFT_ACTIVITIES_FIELDS,
} from "@/constants/nft";
import { getEndDateTimestamp, getStartDateTimestamp } from "@/utils/utils";
import { getPurchaseHistory, getSaleHistory } from "@/services/api/transaction";
const { FIELD, ORDER, ASC, DESC } = ORDERS;
const { FROM, UNTIL, SORT, KEYWORD } = NFT_ACTIVITIES_FIELDS;
const {
  CREATED_AT,
  QUANTITY,
  UNIT_PRICE,
  SUB_TOTAL,
  NFT_NAME,
  DEFAULT,
  PROFIT,
  REVENUE,
} = NFT_ACTIVITIES_FIELD_SORTER;

export const useGetListNFTs = (params?: any, isOwned?: boolean) => {
  const { address } = useAppSelector(selectedAddress.getAddress);
  const nftSize = useGetNFTSize();

  const newParams = pick({ ...params }, [KEY_SEARCH.PAGE]) as any;
  newParams[KEY_SEARCH.LIMIT] = nftSize;
  newParams[KEY_SEARCH.ISOWNED] = isOwned;
  if (params?.[ORDER] && params?.[FIELD]) {
    newParams[`${KEY_SEARCH.SORT}[${params?.[FIELD]}]`] = params.order;
  }

  const sorter = NFTS_SORTER.find(
    (sorter) => sorter?.value === params?.[KEY_SEARCH.SORT]
  );

  newParams[`${KEY_SEARCH.SORT}[${sorter?.field}]`] = sorter?.order;
  newParams[KEY_SEARCH.KEYWORD] = params.keyword;

  for (const key in newParams) {
    if (!newParams[key]) {
      delete newParams[key];
    }
  }

  const handleGetListNFTs = async () => {
    try {
      const response = await getNfts(newParams);

      return get(response, "data");
    } catch (error) {
      throw error;
    }
  };

  const useFetchListNFTs: any = useQuery({
    queryKey: ["getListNFTs", isOwned, address],
    queryFn: () => handleGetListNFTs(),
    refetchOnWindowFocus: false,
    enabled: !!newParams,
  });

  const { isLoading } = useFetchListNFTs;

  return {
    loading: isLoading,
    data: useFetchListNFTs.data,
    refetch: useFetchListNFTs.refetch,
  };
};

export const useGetListSaleHistory = (params?: any) => {
  const { address } = useAppSelector(selectedAddress.getAddress);

  const INDEXED_SORTER = {
    [DEFAULT]: { [CREATED_AT]: DESC },
    [CREATED_AT]: { [CREATED_AT]: DESC },
    [NFT_NAME]: { [NFT_NAME]: ASC, [CREATED_AT]: DESC },
    [UNIT_PRICE]: { [UNIT_PRICE]: ASC, [CREATED_AT]: DESC },
    [QUANTITY]: { [QUANTITY]: DESC, [UNIT_PRICE]: ASC, [CREATED_AT]: DESC },
    [SUB_TOTAL]: { [SUB_TOTAL]: ASC, [CREATED_AT]: DESC },
  };

  const newParams = omit({ ...params }, [FIELD, ORDER]) as any;
  newParams.from = getStartDateTimestamp(params?.[FROM]);
  newParams.until = getEndDateTimestamp(params?.[UNTIL]);
  newParams[KEYWORD] = params?.[KEYWORD]?.trim();
  const field = params?.[FIELD] || DEFAULT;

  for (const key in INDEXED_SORTER?.[field]) {
    if (key === field && params?.[ORDER] && params?.[FIELD]) {
      newParams[`${SORT}[${key}]`] = params?.[ORDER];
    } else {
      newParams[`${SORT}[${key}]`] = INDEXED_SORTER?.[field]?.[key];
    }
  }

  for (const key in newParams) {
    if (!newParams[key]) {
      delete newParams[key];
    }
  }
  const handleGetListSaleHistory = async () => {
    try {
      const response = await getSaleHistory(newParams);
      return get(response, "data");
    } catch (error) {
      throw error;
    }
  };

  const useFetchListSaleHistory: any = useQuery({
    queryKey: ["getListSaleHistory", newParams, address],
    queryFn: () => handleGetListSaleHistory(),
    refetchOnWindowFocus: false,
    enabled: !!newParams,
  });

  const { isLoading } = useFetchListSaleHistory;

  return {
    loading: isLoading,
    data: useFetchListSaleHistory.data,
  };
};

export const useGetListPurchaseHistory = (params?: any) => {
  const { address } = useAppSelector(selectedAddress.getAddress);

  const INDEXED_SORTER = {
    [DEFAULT]: { [CREATED_AT]: DESC },
    [CREATED_AT]: { [CREATED_AT]: DESC },
    [NFT_NAME]: { [NFT_NAME]: ASC, [CREATED_AT]: DESC },
    [UNIT_PRICE]: { [UNIT_PRICE]: ASC, [CREATED_AT]: DESC },
    [QUANTITY]: { [QUANTITY]: DESC, [UNIT_PRICE]: ASC, [CREATED_AT]: DESC },
    [SUB_TOTAL]: { [SUB_TOTAL]: ASC, [CREATED_AT]: DESC },
  };

  const newParams = omit({ ...params }, [FIELD, ORDER]) as any;
  newParams.from = getStartDateTimestamp(params?.[FROM]);
  newParams.until = getEndDateTimestamp(params?.[UNTIL]);
  newParams[KEYWORD] = params?.[KEYWORD]?.trim();
  const field = params?.[FIELD] || DEFAULT;

  for (const key in INDEXED_SORTER?.[field]) {
    if (key === field && params?.[ORDER] && params?.[FIELD]) {
      newParams[`${SORT}[${key}]`] = params?.[ORDER];
    } else {
      newParams[`${SORT}[${key}]`] = INDEXED_SORTER?.[field]?.[key];
    }
  }

  for (const key in newParams) {
    if (!newParams[key]) {
      delete newParams[key];
    }
  }
  const handleGetListPurchaseHistory = async () => {
    try {
      const response = await getPurchaseHistory(newParams);
      return get(response, "data");
    } catch (error) {
      throw error;
    }
  };

  const useFetchListPurchaseHistory: any = useQuery({
    queryKey: ["getListPurchaseHistory", newParams, address],
    queryFn: () => handleGetListPurchaseHistory(),
    refetchOnWindowFocus: false,
    enabled: !!newParams,
  });

  const { isLoading } = useFetchListPurchaseHistory;

  return {
    loading: isLoading,
    data: useFetchListPurchaseHistory.data,
  };
};
