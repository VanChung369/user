import { LENGTH_CONSTANTS, ORDERS } from "@/constants";
import {
  NFT_ACTIVITIES_FIELD_SORTER,
  NFT_ACTIVITIES_FIELDS,
  NFT_LISTING_FIELD_SORTER,
} from "@/constants/nft";
import { useAppSelector } from "@/hooks";
import selectedAddress from "@/redux/address/selector";
import selectedConnection from "@/redux/connection/selector";
import { checkSuccessRequest } from "@/services";
import {
  getActivities,
  getListing,
  getNftDetail,
  getNfts,
  getOwned,
} from "@/services/api/nft";
import { useQuery } from "@tanstack/react-query";
import { useAddress } from "@thirdweb-dev/react";
import { get, omit } from "lodash";
import { useEffect, useState } from "react";

const { SORT, PAGE, LIMIT } = NFT_ACTIVITIES_FIELDS;
const { DEFAULT_PAGE } = LENGTH_CONSTANTS;
const { ORDER, FIELD, ASC, DESC } = ORDERS;
const {
  CREATED_AT: listingCreatedAt,
  REMAIN: listingRemain,
  UNIT_PRICE: listingUnitPrice,
  DEFAULT: listingDefault,
} = NFT_LISTING_FIELD_SORTER;

const {
  CREATED_AT: activitiesCreatedAt,
  QUANTITY: activitiesQuantity,
  UNIT_PRICE: activitiesUnitPrice,
  DEFAULT: activitiesDefault,
} = NFT_ACTIVITIES_FIELD_SORTER;

export const useGetNftDetail = (id: string) => {
  const { address } = useAppSelector(selectedAddress.getAddress);

  const handleGetNftDetail = async () => {
    try {
      const response = await getNftDetail(id);

      return get(response, "data");
    } catch (error) {
      throw error;
    }
  };

  const useFetchNftDetail: any = useQuery({
    queryKey: ["getNftDetail", id, address],
    queryFn: () => handleGetNftDetail(),
    refetchOnWindowFocus: false,
    enabled: !!id,
  });

  const { isLoading } = useFetchNftDetail;

  return {
    loading: isLoading,
    data: useFetchNftDetail.data,
  };
};

export const useGetOwned = (id: string, params?: any) => {
  const { address } = useAppSelector(selectedAddress.getAddress);
  const { isConnected } = useAppSelector(selectedConnection.getConnection);
  const account = useAddress();

  const handleGetOwned = async () => {
    try {
      const response = await getOwned(id, params);

      return get(response, "data");
    } catch (error) {
      throw error;
    }
  };

  const useFetchGetOwned: any = useQuery({
    queryKey: ["getOwned", id, address],
    queryFn: () => handleGetOwned(),
    refetchOnWindowFocus: false,
    enabled: !!id && !!isConnected && !!address && !!account,
  });

  const { isLoading } = useFetchGetOwned;

  return {
    loading: isLoading,
    data: useFetchGetOwned.data,
  };
};

export const useGetListing = (id: string, params?: any) => {
  const { address } = useAppSelector(selectedAddress.getAddress);

  const INDEXED_SORTER = {
    [listingCreatedAt]: { [listingCreatedAt]: DESC },
    [listingUnitPrice]: { [listingUnitPrice]: ASC, [listingCreatedAt]: DESC },
    [listingDefault]: { [listingUnitPrice]: ASC, [listingCreatedAt]: DESC },
    [listingRemain]: {
      [listingRemain]: DESC,
      [listingUnitPrice]: ASC,
      [listingCreatedAt]: DESC,
    },
  };

  const newParams = omit({ ...params }, [FIELD, ORDER]) as any;

  const field = params?.[FIELD] || listingDefault;

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

  const handleGetListing = async () => {
    try {
      const response = await getListing(id, newParams);

      return get(response, "data");
    } catch (error) {
      throw error;
    }
  };

  const useFetchListing: any = useQuery({
    queryKey: ["getListing", newParams, address],
    queryFn: () => handleGetListing(),
    refetchOnWindowFocus: false,
    enabled: !!newParams,
  });

  const { isLoading } = useFetchListing;

  return {
    loading: isLoading,
    data: useFetchListing.data,
  };
};

export const useGetActivities = (id: string, params?: any) => {
  const { address } = useAppSelector(selectedAddress.getAddress);

  const INDEXED_SORTER = {
    [activitiesCreatedAt]: { [activitiesCreatedAt]: DESC },
    [activitiesUnitPrice]: {
      [activitiesUnitPrice]: ASC,
      [activitiesCreatedAt]: DESC,
    },
    [activitiesDefault]: {
      [activitiesUnitPrice]: ASC,
      [activitiesCreatedAt]: DESC,
    },
    [activitiesQuantity]: {
      [activitiesQuantity]: DESC,
      [activitiesUnitPrice]: ASC,
      [activitiesCreatedAt]: DESC,
    },
  };

  const newParams = omit({ ...params }, [FIELD, ORDER]) as any;

  const field = params?.[FIELD] || activitiesDefault;

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

  const handleGetActivities = async () => {
    try {
      const response = await getActivities(id, newParams);

      return get(response, "data");
    } catch (error) {
      throw error;
    }
  };

  const useFetchActivities: any = useQuery({
    queryKey: ["geActivities", newParams, address],
    queryFn: () => handleGetActivities(),
    refetchOnWindowFocus: false,
    enabled: !!newParams,
  });

  const { isLoading } = useFetchActivities;

  return {
    loading: isLoading,
    data: useFetchActivities.data,
  };
};

export const useGetListNFTs = (params?: any) => {
  const { address } = useAppSelector(selectedAddress.getAddress);

  const handleGetListNFTs = async () => {
    try {
      const response = await getNfts(params);

      return get(response, "data");
    } catch (error) {
      throw error;
    }
  };

  const useFetchListNFTs: any = useQuery({
    queryKey: ["getListNFTs", params, address],
    queryFn: () => handleGetListNFTs(),
    refetchOnWindowFocus: false,
    enabled: !!params,
  });

  const { isLoading } = useFetchListNFTs;

  return {
    loading: isLoading,
    data: useFetchListNFTs.data,
  };
};
