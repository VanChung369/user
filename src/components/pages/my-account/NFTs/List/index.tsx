import React, { Fragment } from "react";
import { useIntl } from "react-intl";
import { useGetNFTSize } from "@/hooks/hook-customs/useGetNFTSize";
import { NFTS_SORTER } from "@/constants/marketplace";
import { LENGTH_CONSTANTS } from "@/constants";
import FormWrapper from "@/components/FormWrapper";
import { TYPE_INPUT } from "@/constants/input";
import LoadingWrapper from "@/components/LoadingWrapper";
import { Col, Row } from "antd";
import { Formik } from "formik";
import { noop } from "lodash";
import NFTItem from "@/components/NFTItem";
import style from "./index.module.scss";
import PaginationCustom from "@/components/Pagination";
import Nodata from "@/components/Nodata";
import AppLink from "@/components/AppLink";
import ROUTES_PATH from "@/constants/routesPath";
import { initialValues, KEY_SEARCH } from "..";

type ListProps = {
  data?: Array<any>;
  loading?: boolean;
  total?: number;
  params?: any;
  emptyText?: string;
  onSubmit: (values: any) => void;
};

const { DEFAULT_PAGE } = LENGTH_CONSTANTS;

const List = ({
  data,
  total = 0,
  loading,
  params,
  emptyText,
  onSubmit,
}: ListProps) => {
  const intl = useIntl();
  const nftSize = useGetNFTSize();

  const sortbyOptions = NFTS_SORTER.map((sorter) => ({
    ...sorter,
    name: intl.formatMessage({ id: sorter?.label }),
  }));

  const handleSelectChange = (field: string) => (value: string | number) => {
    onSubmit({
      ...params,
      [field]: value,
      [KEY_SEARCH.PAGE]: DEFAULT_PAGE,
    });
  };

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
            <div className={style.nft_list_filter}>
              <FormWrapper
                label={intl.formatMessage({ id: "marketplace.sort.by" })}
                placeholder={intl.formatMessage({ id: "marketplace.sort.by" })}
                options={sortbyOptions}
                name={KEY_SEARCH.SORT}
                onChange={handleSelectChange(KEY_SEARCH.SORT)}
                typeInput={TYPE_INPUT.SELECT}
                allowClear
              />
            </div>
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
                        md={8}
                        lg={8}
                        xl={6}
                        xxl={6}
                      >
                        <AppLink
                          href={`${ROUTES_PATH.NFT_DETAIL}/${item?._id}`}
                        >
                          <NFTItem nft={item} />
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
              <Nodata emptyText={emptyText} />
            )}
          </div>
        </div>
      </Formik>
    </Fragment>
  );
};

export default List;
