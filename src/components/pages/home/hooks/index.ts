import { useAppSelector } from "@/hooks";
import selectedAddress from "@/redux/address/selector";
import { getCollections } from "@/services/api/collection";
import { getOverview } from "@/services/api/home";
import { getNfts } from "@/services/api/nft";
import { getTags } from "@/services/api/tag";
import { useQuery } from "@tanstack/react-query";
import { get } from "lodash";

//get Overview
export const useGetOverview = () => {
  const handleGetOverview = async () => {
    try {
      const res = await getOverview();
      return get(res, "data");
    } catch (error) {
      throw error;
    }
  };

  const useFetchOverview: any = useQuery({
    queryKey: ["getOverview"],
    queryFn: () => handleGetOverview(),
    refetchOnWindowFocus: false,
  });

  const { isLoading, isError } = useFetchOverview;

  return {
    loading: isLoading,
    error: isError,
    data: useFetchOverview.data,
  };
};

export const useGetListCollections = (params?: any) => {
  const { address } = useAppSelector(selectedAddress.getAddress);

  const handleGetListCollections = async () => {
    try {
      const response = await getCollections(params);

      return get(response, "data");
    } catch (error) {
      throw error;
    }
  };

  const useFetchListCollections: any = useQuery({
    queryKey: ["getListCollections", params, address],
    queryFn: () => handleGetListCollections(),
    refetchOnWindowFocus: false,
    enabled: !!params,
  });

  const { isLoading } = useFetchListCollections;

  return {
    loading: isLoading,
    data: useFetchListCollections.data,
  };
};

export const useGetListTags = (params?: any) => {
  const { address } = useAppSelector(selectedAddress.getAddress);
  const handleGetListTags = async () => {
    try {
      const response = await getTags(params);

      return get(response, "data");
    } catch (error) {
      throw error;
    }
  };

  const useFetchListTags: any = useQuery({
    queryKey: ["getListTags", params, address],
    queryFn: () => handleGetListTags(),
    refetchOnWindowFocus: false,
    enabled: !!params,
  });

  const { isLoading } = useFetchListTags;

  return {
    loading: isLoading,
    data: useFetchListTags.data,
  };
};

export const useGetListNFTs = (params?: any) => {
  const { address } = useAppSelector(selectedAddress.getAddress);

  const handleGetListNFTs = async () => {
    try {
      const response = await getNfts();

      return get(response, "data");
    } catch (error) {
      throw error;
    }
  };

  const useFetchListNFTs: any = useQuery({
    queryKey: ["getListNFTs", address],
    queryFn: () => handleGetListNFTs(),
    refetchOnWindowFocus: false,
  });

  const { isLoading } = useFetchListNFTs;

  return {
    loading: isLoading,
    data: useFetchListNFTs.data,
  };
};
