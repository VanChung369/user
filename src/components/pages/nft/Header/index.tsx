import Countdown, { zeroPad } from "react-countdown";
import { Fragment, useEffect, useRef } from "react";
import { SALE_STATUS_ORDER_VALUE } from "@/constants/saleOrder";
import { useIntl } from "react-intl";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/hooks";
import selectedAddress from "@/redux/address/selector";
import style from "./index.module.scss";
import AppLink from "@/components/AppLink";
import ROUTES_PATH from "@/constants/routesPath";
import { formatDate } from "@/utils/utils";
import { DEFAULT_SEARCH_DATE_TIME_FORMAT } from "@/constants/input";

const { SOLD_OUT, LISTED, DELISTED, COMING_SOON } = SALE_STATUS_ORDER_VALUE;

const Header = () => {
  const intl = useIntl();
  const router = useRouter();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const timeRef = useRef<any>(null);
  const nftId = Array.isArray(id) ? id[0] : id;
  const { address } = useAppSelector(selectedAddress.getAddress);
  const query: any = queryClient.getQueryData(["getNftDetail", nftId, address]);

  const nameEvent =
    query?.saleOrder?.status === SALE_STATUS_ORDER_VALUE.LISTED ? (
      <>{intl.formatMessage({ id: "home.banner.ends.in" })}</>
    ) : query?.saleOrder?.status === SALE_STATUS_ORDER_VALUE.COMING_SOON ? (
      <>{intl.formatMessage({ id: "home.banner.starts.in" })}</>
    ) : (
      <></>
    );

  const renderer = ({ days, hours, minutes, seconds }: any) => {
    return (
      <div className={style.countdown}>
        <div className={style.label}>{nameEvent}</div>
        <div className={style.time}>
          <div className={style.countdown_item}>
            <span>
              {days}
              {intl.formatMessage({ id: "home.banner.day" })}
            </span>
          </div>
          <div className={style.countdown_item}>
            <span>
              {zeroPad(hours)}
              {intl.formatMessage({ id: "home.banner.hour" })}
            </span>
          </div>
          <div className={style.countdown_item}>
            <span>
              {zeroPad(minutes)}
              {intl.formatMessage({ id: "home.banner.minute" })}
            </span>
          </div>
          <div className={style.countdown_item}>
            <span>
              {zeroPad(seconds)}
              {intl.formatMessage({ id: "home.banner.second" })}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const onComplete = () => {
    router.replace(window.location.href);
  };

  const addSeconds = (numOfHours: number, date: Date) => {
    date.setTime(date.getTime() + numOfHours * 1000);
    return date;
  };

  useEffect(() => {
    setTimeout(() => timeRef.current?.start());
  }, [query]);

  return (
    <div className={style.nft_detail_header}>
      <div className="container">
        <div className={style.nft_detail_header_wrap}>
          <div className={style.nft_detail_header_breadcrum}>
            <span>
              <AppLink href={ROUTES_PATH.HOME}>
                {intl.formatMessage({ id: "header.home" })}
              </AppLink>
            </span>
            <span>
              <AppLink href={ROUTES_PATH.MARKETPLACE}>
                {intl.formatMessage({ id: "header.marketplace" })}
              </AppLink>
            </span>
            <span> {intl.formatMessage({ id: "NFT.detail" })}</span>
          </div>
          {query?.saleOrder?.endDate &&
            query?.saleOrder?.startDate &&
            (query?.saleOrder?.status !== DELISTED ? (
              query?.saleOrder?.status === LISTED ? (
                <Countdown
                  date={addSeconds(2, new Date(query?.saleOrder?.endDate))}
                  renderer={renderer}
                  onComplete={onComplete}
                  ref={timeRef}
                />
              ) : (
                <Countdown
                  date={addSeconds(2, new Date(query?.saleOrder?.startDate))}
                  renderer={renderer}
                  onComplete={onComplete}
                  ref={timeRef}
                />
              )
            ) : (
              <p className={style.nft_detail_header_timet_text}>
                <span className={style.nft_detail_header_timet_text_label}>
                  {intl.formatMessage({ id: "NFT.detail.ended" })}:&nbsp;
                </span>
                <span>
                  {formatDate(
                    query?.saleOrder?.startDate,
                    DEFAULT_SEARCH_DATE_TIME_FORMAT
                  )}
                </span>
                -
                <span>
                  {formatDate(
                    query?.saleOrder?.endDate,
                    DEFAULT_SEARCH_DATE_TIME_FORMAT
                  )}
                </span>
              </p>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Header;
