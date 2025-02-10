"use client";
import React, { FC } from "react";
import { Typography, Modal, Image } from "antd";
import { useAppSelector } from "@/hooks";
import style from "./index.module.scss";
import selectedConnection from "@/redux/connection/selector";
import { useAddress, useSwitchChain } from "@thirdweb-dev/react";
import PanBunnyIcon from "@public/images/pan-bunny.png";
import PolygonIcon from "@public/images/polygon_icon.png";
import NextIcon from "@public/svg/next-icon.svg";
import { outLogin } from "@/services/api/auth";
import { useIntl } from "react-intl";

const { Paragraph } = Typography;

type ModalWrongNetworkProps = {};

const ModalWrongNetwork: FC<ModalWrongNetworkProps> = () => {
  const intl = useIntl();
  const switchChain = useSwitchChain();
  const { isWrongNetwork } = useAppSelector(selectedConnection.getConnection);
  const account = useAddress();

  const disconnect = async () => {
    await outLogin({}, account);
  };

  return (
    <Modal
      className={style.container}
      open={isWrongNetwork}
      width={400}
      footer={false}
      closable={false}
      destroyOnClose
    >
      <div className={style.wrong_network}>
        <Paragraph className={style.wrong_network__title}>
          {intl.formatMessage({
            id: "login.wrong.network",
          })}
        </Paragraph>
        <Paragraph className={style.wrong_network__subtitle}>
          {intl.formatMessage({
            id: "login.wrong.network.title",
          })}
        </Paragraph>
        <Paragraph className={style.wrong_network__subtitle}>
          {intl.formatMessage({
            id: "login.wrong.network.subtitle",
          })}
        </Paragraph>
        <div className={style.wrong_network__image}>
          <Image
            className={style.wrong_network__icon}
            preview={false}
            height={150}
            width={200}
            src={PanBunnyIcon.src}
            alt="loading"
          />
        </div>

        <div className={style.wrong_network__switch}>
          <img
            className={style.wrong_network__switch_icon}
            src={NextIcon.src}
            alt="next"
          />
          <Image
            width={24}
            height={24}
            preview={false}
            src={PolygonIcon.src}
            alt="loading"
          />
          <Paragraph className={style.wrong_network__switch_title}>
            {intl.formatMessage({
              id: "login.wrong.network.switch",
            })}
          </Paragraph>
        </div>

        <button
          className={style.wrong_network__switch_polygon}
          onClick={() =>
            switchChain(Number(process.env.NEXT_PUBLIC_APP_CHAIN_ID))
          }
        >
          {intl.formatMessage({
            id: "login.wrong.network.switch.polygon",
          })}
        </button>
        <button
          className={style.wrong_network__disconnect}
          onClick={disconnect}
        >
          {intl.formatMessage({
            id: "login.disconnect.wallet",
          })}
        </button>
      </div>
    </Modal>
  );
};

export default ModalWrongNetwork;
