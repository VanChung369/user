"use client";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useConnectWallet } from "@/hooks/hook-customs/useConnectWallet";
import selectedConnection from "@/redux/connection/selector";
import {
  handleSetConnectModal,
  handleSetLoadingMetamask,
} from "@/redux/connection/slice";
import { Typography, Modal, Image } from "antd";
import { Fragment, useEffect } from "react";
import LoadingIcon from "@public/images/loading.gif";
import NotFoundMetamaskIcon from "@public/images/not_found_metamask.png";
import style from "./index.module.scss";
import { METAMASK_DOWLOAD } from "@/constants";
import { useIntl } from "react-intl";
import AddToWallet from "../AddToWallet";
import { WALLET_TYPE } from "@/constants/wallet";
import InfoIcon from "@public/svg/info-icon.svg";

declare let window: any;

const { Paragraph } = Typography;

const ModalConnectWallet = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const { isShowConnectModal, isConnectingWallet } = useAppSelector(
    selectedConnection.getConnection
  );
  const { handleConnect } = useConnectWallet();
  const handleHideModalConnectWallet = () =>
    dispatch(handleSetConnectModal(false));
  const handleLoadingMetamask = () => dispatch(handleSetLoadingMetamask(false));
  const handleDispatchConnectMetamask = () =>
    dispatch(handleSetLoadingMetamask(true));

  const handleCloseModalConnectWallet = () => {
    handleHideModalConnectWallet();
    handleLoadingMetamask();
  };

  const isEthereum =
    typeof window !== "undefined" && !!window?.ethereum?.isMetaMask;

  const handleConnectMetamask = () => {
    handleConnect();
    handleHideModalConnectWallet();
  };

  useEffect(() => {
    if (isConnectingWallet) {
      handleConnectMetamask();
    }
  }, [isConnectingWallet]);

  const renderConnectWallet = () => (
    <div className={style.wallet}>
      <p className={style.wallet__title}>
        {intl.formatMessage({
          id: "login.connect.metamask",
        })}
      </p>
      <div className={style.wallet__button}>
        <p
          className={style.wallet__button__sub_title}
          dangerouslySetInnerHTML={{
            __html: intl.formatMessage({
              id: "login.connect.wallet.content",
            }),
          }}
        />
        <AddToWallet
          walletType={WALLET_TYPE.METAMASK}
          text={
            <Fragment>
              <span>
                {intl.formatMessage({
                  id: "login.metamask",
                })}
              </span>
            </Fragment>
          }
          onClick={handleDispatchConnectMetamask}
        />
        <p className={style.wallet__button__sub_note}>
          <img
            className={style.wallet__button__sub_note__image}
            src={InfoIcon.src}
          />
          <span
            dangerouslySetInnerHTML={{
              __html: intl.formatMessage({
                id: "login.connect.wallet.note",
              }),
            }}
          />
        </p>
      </div>
    </div>
  );

  const renderNoMetamask = () => (
    <div className={style.connect}>
      {isEthereum ? (
        <div className={style.connect__loading}>
          <Paragraph className={style.connect__loading_title}>
            {intl.formatMessage({
              id: "login.connect.metamask",
            })}
          </Paragraph>
          <div className={style.connect__loading_image}>
            <Image
              className={style.connect__loading_icon}
              preview={false}
              height={150}
              width={150}
              src={LoadingIcon.src}
              alt="loading"
            />
          </div>
          <Paragraph className={style.connect__loading_subtitle}>
            {intl.formatMessage({
              id: "login.connect.metamask.subtitle",
            })}
          </Paragraph>
        </div>
      ) : (
        <div className={style.connect__not_found}>
          <Paragraph className={style.connect__not_found_title}>
            {intl.formatMessage({
              id: "login.metamask.not.found",
            })}
          </Paragraph>

          <div className={style.connect__not_found_image}>
            <Image
              className={style.connect__not_found_icon}
              preview={false}
              height={150}
              width={150}
              src={NotFoundMetamaskIcon.src}
              alt="metamask not found"
            />
          </div>
          <Paragraph className={style.connect__not_found_subtitle}>
            {intl.formatMessage({
              id: "login.metamask.not.found.subtitle",
            })}
          </Paragraph>

          <div className={style.connect__not_found_download}>
            <a
              target="_blank"
              href={METAMASK_DOWLOAD}
              className="link"
              rel="noreferrer"
            >
              {intl.formatMessage({
                id: "login.metamask.install",
              })}
            </a>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Modal
      className={style.container}
      onCancel={handleCloseModalConnectWallet}
      footer={false}
      width={isShowConnectModal ? 565 : 400}
      maskClosable={isShowConnectModal || !isEthereum}
      open={isShowConnectModal || isConnectingWallet}
    >
      {isShowConnectModal ? renderConnectWallet() : renderNoMetamask()}
    </Modal>
  );
};

export default ModalConnectWallet;
