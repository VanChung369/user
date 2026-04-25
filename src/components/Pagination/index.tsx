import React from "react";
import { Pagination } from "antd";
import classNames from "classnames";
import NextPaginationIcon from "@public/svg/next-pagination.svg";
import PrevPaginationIcon from "@public/svg/prev-pagination.svg";
import { LENGTH_CONSTANTS } from "@/constants";
import Image from "next/image";
import style from "./index.module.scss";

const {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
  DEFAULT_TOTAL,
  DEFAULT_PAGE,
} = LENGTH_CONSTANTS;

type AppPaginationProps = {
  onChange?: (page: number, pageSize: number) => void;
  pageSizeOptions?: string[];
  current?: number;
  pageSize?: number;
  total: number;
  showSizeChanger?: boolean;
  className?: string;
  renderPagination?: any;
};

const PaginationCustom = ({
  onChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  pageSize = DEFAULT_PAGE_SIZE,
  showSizeChanger,
  current = DEFAULT_PAGE,
  total = DEFAULT_TOTAL,
  className,
  renderPagination,
  ...props
}: AppPaginationProps) => {
  const renderCustomPagination = (
    _current: number,
    type: string,
    originalElement: any
  ) => {
    if (type === "prev") {
      return (
        <div className={style.paging_prev}>
          <Image src={PrevPaginationIcon} alt={"prev icon"} />
        </div>
      );
    }
    if (type === "next") {
      return (
        <div className={style.next_prev}>
          <Image src={NextPaginationIcon} alt={"next icon"} />
        </div>
      );
    }
    return originalElement;
  };

  return (
    <Pagination
      total={total}
      current={current}
      pageSize={pageSize}
      itemRender={renderPagination || renderCustomPagination}
      onChange={onChange}
      className={classNames(style.pagination, className)}
      showSizeChanger={showSizeChanger}
      pageSizeOptions={pageSizeOptions}
      simple={{ readOnly: true }}
      {...props}
    />
  );
};

export default PaginationCustom;
