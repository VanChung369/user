import React, { Fragment, useEffect } from "react";
import { useIntl } from "react-intl";
import { useGetListNFTs } from "../hooks";
import List from "./List";

type NFTProps = {
  params?: any;
  onSubmit: (values: any) => void;
  setTotalNfts?: any;
};

const NFTs = ({ params, setTotalNfts, onSubmit }: NFTProps) => {
  const intl = useIntl();
  const isOwned = false;

  const { data, loading } = useGetListNFTs(params, isOwned);

  useEffect(() => {
    setTotalNfts(data?.totalDocs);
  }, [data?.totalDocs]);

  return (
    <Fragment>
      <List
        data={data?.docs}
        loading={loading}
        total={data?.totalDocs}
        params={params}
        onSubmit={onSubmit}
        emptyText={intl.formatMessage({ id: "common.text.no.data" })}
      />
    </Fragment>
  );
};

export default NFTs;
