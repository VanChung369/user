import React, { Fragment } from "react";
import { useGetNFTSize } from "@/hooks/hook-customs/useGetNFTSize";
import { MARKETPLACE_TABS } from "@/constants/marketplace";
import { initialValues, KEY_SEARCH } from "../..";
import LoadingWrapper from "@/components/LoadingWrapper";
import { Col, Row } from "antd";
import { Formik } from "formik";
import { noop } from "lodash";
import style from "./index.module.scss";
import PaginationCustom from "@/components/Pagination";
import CollectionItem from "@/components/CollectionItem";
import AppLink from "@/components/AppLink";
import ROUTES_PATH, { QUERY } from "@/constants/routesPath";

type ListProps = {
  data?: Array<any>;
  loading?: boolean;
  total?: number;
  params?: any;
  emptyText?: string;
  onSubmit: (values: any) => void;
};

const List = ({
  data,
  total = 0,
  loading,
  params,
  emptyText,
  onSubmit,
}: ListProps) => {
  const nftSize = useGetNFTSize();

  const handleChangePagination = (page: number, limit: number) => {
    onSubmit({
      ...params,
      [KEY_SEARCH.PAGE]: page,
      [KEY_SEARCH.LIMIT]: limit,
    });
  };

  return (
    <Fragment>
      <Formik initialValues={initialValues} onSubmit={noop}>
        <div className={style.nft_list}>
          <div>
            {loading ? (
              <LoadingWrapper loading={true} />
            ) : total > 0 ? (
              <Fragment>
                <div className={style.nft_list_content}>
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    {data?.map((item) => (
                      <Col
                        key={item?._id}
                        xs={24}
                        sm={12}
                        md={12}
                        lg={8}
                        xl={8}
                        xxl={8}
                      >
                        <AppLink
                          href={`${ROUTES_PATH.MARKETPLACE}?${QUERY.COLLECTION}=${item?._id}&${QUERY.MARKET_PLACE_TAB_QUERY}=${MARKETPLACE_TABS.NFTS.type}`}
                        >
                          <CollectionItem collection={item} />
                        </AppLink>
                      </Col>
                    ))}
                  </Row>
                </div>
                <PaginationCustom
                  total={total}
                  current={params?.[KEY_SEARCH.PAGE]}
                  pageSize={nftSize}
                  onChange={handleChangePagination}
                  showSizeChanger={false}
                />
              </Fragment>
            ) : (
              "no data"
            )}
          </div>
        </div>
      </Formik>
    </Fragment>
  );
};

export default List;
