import AppLink from "@/components/AppLink";
import ButtonWrapper from "@/components/ButtonWrapper";
import DropdownWrapper from "@/components/DropdownWrapper";
import ShortenAddress from "@/components/ShortenAddress";
import { KEY_STORAGE } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  handleRemoveAddressNetwork,
  handleSetAddressNetwork,
} from "@/redux/address/slice";
import { handleSetAuthenticationToken } from "@/redux/authentication/slice";
import selectedConnection from "@/redux/connection/selector";
import { setTokenCallApi } from "@/utils/api";
import { shortenAddress, useAddress, useDisconnect } from "@thirdweb-dev/react";
import { MenuProps } from "antd";
import Cookies from "js-cookie";
import DisconnectIcon from "@public/svg/disconnect-icon.svg";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import styles from "./index.module.scss";
import classNames from "classnames";
import { useIntl } from "react-intl";
import Image from "next/image";
import ROUTES_PATH from "@/constants/routesPath";

const Desktop = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const account = useAddress();
  const { isConnected } = useAppSelector(selectedConnection.getConnection);
  const disconnectWallet = useDisconnect();

  const handleDisconnect = () => {
    setTokenCallApi("");
    Cookies.remove(KEY_STORAGE);
    disconnectWallet();
    dispatch(handleRemoveAddressNetwork({ account }));
    dispatch(handleSetAddressNetwork({}));
    dispatch(handleSetAuthenticationToken({}));
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div className={styles.desktop_menu}>
          <div className={classNames(styles.item)}>
            <ShortenAddress
              address={account}
              extraShort={true}
              isCopy={true}
              className={styles.desktop_menu__address}
            />
          </div>
          <AppLink href={ROUTES_PATH.MY_ACCOUNT}>
            <div className={styles.item}>
              <span>{intl.formatMessage({ id: "header.user.account" })}</span>
            </div>
          </AppLink>
          <div
            className={classNames(styles.item, "border-bottom-none")}
            onClick={handleDisconnect}
          >
            <Image src={DisconnectIcon} alt={"disconnect icon"} />
            <span className={styles.disconnect}>
              {intl.formatMessage({ id: "header.user.disconnect" })}
            </span>
          </div>
        </div>
      ),
    },
  ];

  return isConnected ? (
    <DropdownWrapper menu={{ items }}>
      <ButtonWrapper
        text={shortenAddress(account, true)}
        variant="default"
        className={styles.desktop__button}
      />
    </DropdownWrapper>
  ) : (
    <ConnectWalletButton />
  );
};

export default Desktop;
