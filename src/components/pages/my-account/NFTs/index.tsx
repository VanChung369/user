import React, { Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useGetListNFTs } from "../hooks";
import List from "./List";
import { useAppSelector } from "@/hooks";
import selectedAddress from "@/redux/address/selector";
import { useRouter } from "next/navigation";
import ROUTES_PATH from "@/constants/routesPath";
import { LENGTH_CONSTANTS } from "@/constants";
import { NFTS_SORTER } from "@/constants/marketplace";

const { DEFAULT_PAGE } = LENGTH_CONSTANTS;

export const KEY_SEARCH = {
  KEYWORD: "keyword",
  ISOWNED: "isOwned",
  PAGE: "page",
  SORT: "sort",
  LIMIT: "limit",
};

export const initialValues = {
  [KEY_SEARCH.KEYWORD]: "",
  [KEY_SEARCH.PAGE]: DEFAULT_PAGE,
  [KEY_SEARCH.SORT]: NFTS_SORTER[0].value,
};

const NFTs = ({ setDataNft }: any) => {
  const intl = useIntl();
  const router = useRouter();
  const { address } = useAppSelector(selectedAddress.getAddress);
  const isOwned = address ? true : false;
  const [params, setParams] = useState(initialValues);
  const { data, refetch, loading } = useGetListNFTs(params, isOwned);

  useEffect(() => {
    setDataNft(data);
  }, [data]);

  const handleSubmit = (values: any) => {
    setParams({
      ...initialValues,
      ...values,
    });
  };

  useEffect(() => {
    refetch();
  }, [params]);

  useEffect(() => {
    if (!address) {
      router.push(ROUTES_PATH.HOME);
    }
  }, [address]);

  return (
    <Fragment>
      <List
        data={data?.docs}
        loading={loading}
        total={data?.totalDocs}
        params={params}
        onSubmit={handleSubmit}
        emptyText={intl.formatMessage({ id: "common.text.no.data" })}
      />
    </Fragment>
  );
};

export default NFTs;
