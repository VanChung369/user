import { useAppDispatch } from "@/hooks";
import { handleSetConnectModal } from "@/redux/connection/slice";
import classNames from "classnames";
import { useIntl } from "react-intl";
import ButtonWrapper from "../ButtonWrapper";
import styles from "./index.module.scss";
import { useMobile } from "@/hooks/hook-customs/useWindowSize";
import { WALLET_TYPE } from "@/constants/wallet";
import AddToWallet from "../AddToWallet";
import { Fragment } from "react";

type ConnectWalletButtonProps = { className?: string };

const ConnectWalletButton = ({ className }: ConnectWalletButtonProps) => {
  const intl = useIntl();
  const isMobile = useMobile();
  const dispatch = useAppDispatch();

  const handleShowConnectModal = () => dispatch(handleSetConnectModal(true));
  const renderConnect = isMobile ? (
    <AddToWallet
      onClick={handleShowConnectModal}
      walletType={WALLET_TYPE.METAMASK}
      text={
        <Fragment>
          <span>{intl.formatMessage({ id: "login.connect.metamask" })}</span>
        </Fragment>
      }
    />
  ) : (
    <ButtonWrapper
      text={intl.formatMessage({ id: "login.connectwallet" })}
      onClick={handleShowConnectModal}
      className={classNames(styles.connect__button, className)}
    />
  );
  return renderConnect;
};

export default ConnectWalletButton;
