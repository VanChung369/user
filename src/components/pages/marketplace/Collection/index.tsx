import React, { Fragment, useEffect } from "react";
import { useIntl } from "react-intl";
import { useGetListCollections } from "../hooks";
import List from "./List";

type NFTProps = {
  params?: any;
  onSubmit: (values: any) => void;
  setTotalCollections?: any;
};

const Collections = ({ params, setTotalCollections, onSubmit }: NFTProps) => {
  const intl = useIntl();
  const { data, loading } = useGetListCollections(params);

  useEffect(() => {
    setTotalCollections(data?.totalDocs);
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

export default Collections;
