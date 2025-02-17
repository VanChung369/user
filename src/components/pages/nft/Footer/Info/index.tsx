import React, { useContext, useEffect, useMemo, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Switch } from "antd";
import selectedConnection from "@/redux/connection/selector";
import { useAppSelector } from "@/hooks";
import { useIntl } from "react-intl";
import { NftDetailContext } from "../..";
import { NFT_DETAIL_TABS } from "@/constants/nft";
import LoadingWrapper from "@/components/LoadingWrapper";
import TabWapper from "@/components/TabWrapper";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import selectedAddress from "@/redux/address/selector";
import Listing from "./Listing";
import style from "./index.module.scss";
import Activities from "./Activities";
import Owned from "./Owned";

const { LISTING, ACTIVITIES, OWNED } = NFT_DETAIL_TABS;

const Info = () => {
  const intl = useIntl();
  const { isRefreshSaleOrder, onSetIsRefreshSaleOrder } = useContext(
    NftDetailContext
  ) as any;
  const { id } = useParams();
  const queryClient = useQueryClient();
  const nftId = Array.isArray(id) ? id[0] : id;
  const { address } = useAppSelector(selectedAddress.getAddress);
  const nftOwned: any = queryClient.getQueryData(["getOwned", nftId, address]);

  const { isConnected } = useAppSelector(selectedConnection.getConnection);
  const [isMySaleOrder, setIsMySaleOrder] = useState(false);
  const [isMyHistory, setIsMyHistory] = useState(false);

  const listTab = [
    {
      key: LISTING.key,
      tab: intl.formatMessage({ id: LISTING.label }),
      content: <Listing isMySaleOrder={isMySaleOrder} />,
    },
    {
      key: ACTIVITIES.key,
      tab: intl.formatMessage({ id: ACTIVITIES.label }),
      content: <Activities isMyHistory={isMyHistory} />,
    },
    {
      key: OWNED.key,
      tab: intl.formatMessage(
        { id: OWNED.label },
        { number: nftOwned?.totalDocs }
      ),
      content: <Owned />,
    },
  ];

  const [activeTab, setActiveTab] = useState(LISTING.key);

  const handleMyHistoryChange = (checked: boolean) => setIsMyHistory(checked);

  const handleMySaleOrderChange = (checked: boolean) =>
    setIsMySaleOrder(checked);

  useEffect(() => {
    if (!isConnected) {
      setIsMyHistory(false);
      setIsMySaleOrder(false);
    }
  }, [isConnected]);

  useEffect(() => {
    if (isRefreshSaleOrder) {
      setTimeout(() => {
        onSetIsRefreshSaleOrder(false);
      }, 1000);
    }
  }, [isRefreshSaleOrder]);

  const handleChangeTab = (value: string) => setActiveTab(value);

  const renderExtraTabLabel = useMemo(() => {
    switch (activeTab) {
      case ACTIVITIES.key:
        return intl.formatMessage({ id: "NFT.detail.my.activities" });
      default:
        return intl.formatMessage({ id: "NFT.detail.my.listings" });
    }
  }, [activeTab]);

  const renderTime = ({ remainingTime }: { remainingTime: number }) => {
    if (remainingTime === 0) {
      return null;
    }
    return <div className={style.timer}>{remainingTime}</div>;
  };

  const renderTabBarExtraContent = useMemo(() => {
    switch (activeTab) {
      case ACTIVITIES.key:
        return (
          isConnected && (
            <div className={style.extra_tabs}>
              <span className={style.extra_tabs_label}>
                {renderExtraTabLabel}
              </span>
              <span className={style.extra_tabs_switch}>
                <Switch
                  onChange={handleMyHistoryChange}
                  checked={isMyHistory}
                />
              </span>
            </div>
          )
        );
      case LISTING.key:
        return (
          <div className={style.extra_tabs}>
            {isConnected && (
              <div>
                <span className={style.extra_tabs_label}>
                  {renderExtraTabLabel}
                </span>
                <span className={style.extra_tabs_switch}>
                  <Switch
                    onChange={handleMySaleOrderChange}
                    checked={isMySaleOrder}
                  />
                </span>
              </div>
            )}
            {isRefreshSaleOrder ? (
              <></>
            ) : (
              <CountdownCircleTimer
                isPlaying
                duration={10}
                colors="#a259ff"
                trailColor="#a259ff"
                onComplete={() => {
                  onSetIsRefreshSaleOrder(true);
                  return { shouldRepeat: true, delay: 1 };
                }}
                size={28}
                strokeWidth={2}
              >
                {renderTime}
              </CountdownCircleTimer>
            )}
          </div>
        );
      default:
        return null;
    }
  }, [activeTab, isMySaleOrder, isMyHistory, isConnected, isRefreshSaleOrder]);

  return (
    <div className={style.style_nft_info}>
      <TabWapper
        onChangeTab={handleChangeTab}
        activeKey={activeTab}
        listTab={listTab}
        tabBarExtraContent={renderTabBarExtraContent}
      />
    </div>
  );
};

export default Info;
