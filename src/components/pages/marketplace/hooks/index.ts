import { useAppSelector } from "@/hooks";
import selectedAddress from "@/redux/address/selector";
import { getCollections } from "@/services/api/collection";
import { getNfts } from "@/services/api/nft";
import { useQuery } from "@tanstack/react-query";
import { get, pick } from "lodash";
import { KEY_SEARCH } from "..";
import { useGetNFTSize } from "@/hooks/hook-customs/useGetNFTSize";
import { ORDERS } from "@/constants";
import { NFTS_SORTER } from "@/constants/marketplace";
const { FIELD, ORDER } = ORDERS;

export const useGetListCollections = (params?: any) => {
  const { address } = useAppSelector(selectedAddress.getAddress);
  const nftSize = useGetNFTSize();

  const newParams = pick({ ...params }, [KEY_SEARCH.PAGE]) as any;
  newParams[KEY_SEARCH.LIMIT] = nftSize;
  newParams[KEY_SEARCH.KEYWORD] = params.keyword;

  for (const key in newParams) {
    if (!newParams[key]) {
      delete newParams[key];
    }
  }

  const handleGetListCollections = async () => {
    try {
      const response = await getCollections(newParams);

      return get(response, "data");
    } catch (error) {
      throw error;
    }
  };

  const useFetchListCollections: any = useQuery({
    queryKey: ["getListCollections", newParams, address],
    queryFn: () => handleGetListCollections(),
    refetchOnWindowFocus: false,
    enabled: !!newParams,
  });

  const { isLoading } = useFetchListCollections;

  return {
    loading: isLoading,
    data: useFetchListCollections.data,
  };
};

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
  newParams[KEY_SEARCH.COLLECTION] = params.collection;
  newParams[KEY_SEARCH.TAG] = params.tag;

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
    queryKey: ["getListNFTs", newParams, address],
    queryFn: () => handleGetListNFTs(),
    refetchOnWindowFocus: false,
    enabled: !!newParams,
  });

  const { isLoading } = useFetchListNFTs;

  return {
    loading: isLoading,
    data: useFetchListNFTs.data,
  };
};
