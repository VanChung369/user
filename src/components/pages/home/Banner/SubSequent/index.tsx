"use client";
import { Col, Progress, ProgressProps, Row } from "antd";
import Countdown, { zeroPad } from "react-countdown";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import moment from "moment";
import { SubSequentProps } from "../typing";
import { useIntl } from "react-intl";
import { SALE_STATUS_ORDER_VALUE } from "@/constants/saleOrder";
import ClockIcon from "@public/svg/icon-clock.svg";
import { DEFAULT_SEARCH_DATE_TIME_FORMAT } from "@/constants/input";
import EllipsisText from "@/components/EllipsisText";
import AppLink from "@/components/AppLink";
import NumberFormatWrapper from "@/components/NumberFormatWrapper";
import ButtonWrapper from "@/components/ButtonWrapper";
import style from "./index.module.scss";
import classNames from "classnames";
import Image from "next/image";

const SubSequent = ({
  quantity,
  sold,
  startDate,
  endDate,
  status,
  nftId,
}: SubSequentProps) => {
  const intl = useIntl();
  const router = useRouter();
  const timeRef = useRef<any>(null);
  const saleOrderIsComing = status === SALE_STATUS_ORDER_VALUE.COMING_SOON;
  const saleOrderIsListed = status === SALE_STATUS_ORDER_VALUE.LISTED;

  const nameEvent =
    status === SALE_STATUS_ORDER_VALUE.LISTED ? (
      <>{intl.formatMessage({ id: "home.banner.ends.in" })}</>
    ) : status === SALE_STATUS_ORDER_VALUE.COMING_SOON ? (
      <>{intl.formatMessage({ id: "home.banner.starts.in" })}</>
    ) : (
      <>{intl.formatMessage({ id: "home.banner.ended.on" })}</>
    );

  const twoColors: ProgressProps["strokeColor"] = {
    "0%": "#108ee9",
    "100%": "#87d068",
  };

  const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    if (completed && saleOrderIsListed) {
      return (
        <div className={classNames(style.ant_statistic, style.text_end)}>
          <Image src={ClockIcon} alt="clock icon" />
          <span className={style.statistic__end}>{`${intl.formatMessage({
            id: "home.banner.ended.on",
          })} ${moment(endDate).format(
            DEFAULT_SEARCH_DATE_TIME_FORMAT
          )}`}</span>
        </div>
      );
    }
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
          <span>:</span>
          <div className={style.countdown_item}>
            <span>
              {zeroPad(hours)}
              {intl.formatMessage({ id: "home.banner.hour" })}
            </span>
          </div>
          <span>:</span>
          <div className={style.countdown_item}>
            <span>
              {zeroPad(minutes)}
              {intl.formatMessage({ id: "home.banner.minute" })}
            </span>
          </div>
          <span>:</span>
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
  }, []);

  return (
    <div className={style.sub_sequent}>
      <Row gutter={24} justify="space-between" align="middle">
        <Col lg={14} md={14} sm={18}>
          <div className={style.sub_sequent_content}>
            <h1 className={style.sub_sequent_content__title}>
              <EllipsisText text={nftId.name} tooltipText={nftId.name} />
            </h1>
            <div className={style.sub_sequent_content__text}>
              <EllipsisText text={nftId.description} />
            </div>
            <div>
              {startDate && endDate && (
                <Countdown
                  date={
                    new Date(
                      saleOrderIsComing
                        ? addSeconds(5, new Date(startDate))
                        : endDate
                    )
                  }
                  renderer={renderer}
                  onComplete={onComplete}
                  ref={timeRef}
                />
              )}
              {!saleOrderIsComing && (
                <div className={style.overview}>
                  <div className={style.overview_title}>
                    {intl.formatMessage({ id: "home.banner.minted" })}
                  </div>
                  <Progress
                    percent={Math.floor((sold / quantity) * 100)}
                    strokeColor={twoColors}
                  />
                </div>
              )}

              {!saleOrderIsComing ? (
                <>
                  <span className={style.sub_sequent_content__text}>
                    {intl.formatMessage({ id: "home.banner.total.minted" })}:{" "}
                    <span>
                      <NumberFormatWrapper value={sold} />/
                      <NumberFormatWrapper value={quantity} />
                    </span>
                  </span>
                </>
              ) : (
                <span className={style.sub_sequent_content__text}>
                  {intl.formatMessage({ id: "home.banner.total.items.sold" })}:{" "}
                  <span>{quantity}</span>
                </span>
              )}
            </div>
            <div>
              <Row justify="space-between" align="middle">
                <Col lg={5} md={24}>
                  {saleOrderIsListed && (
                    <AppLink href={"#"}>
                      <ButtonWrapper
                        text={intl.formatMessage({
                          id: "home.banner.mint.now",
                        })}
                        className={classNames(
                          style.sub_sequent_content__button
                        )}
                      />
                    </AppLink>
                  )}
                </Col>
              </Row>
            </div>
          </div>
        </Col>
        <Col lg={10} md={10} xs={24} className={style.image}>
          <Image
            src={nftId.image.url}
            width={370}
            height={370}
            alt="Picture of the author"
          />
        </Col>
      </Row>
    </div>
  );
};

export default SubSequent;
