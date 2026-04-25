import { Drawer, Menu } from "antd";
import Cookies from "js-cookie";
import CloseIcon from "@public/svg/close-icon.svg";
import DisconnectIcon from "@public/svg/disconnect-icon.svg";
import MenuIcon from "@public/svg/menu-icon.svg";
import UserIcon from "@public/images/no-profile-md.png";
import { useState } from "react";
import AppLink from "@/components/AppLink";
import ShortenAddress from "@/components/ShortenAddress";
import ButtonWrapper from "@/components/ButtonWrapper";
import { setTokenCallApi } from "@/utils/api";
import { KEY_STORAGE } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  handleRemoveAddressNetwork,
  handleSetAddressNetwork,
} from "@/redux/address/slice";
import { handleSetAuthenticationToken } from "@/redux/authentication/slice";
import { useAddress, useDisconnect } from "@thirdweb-dev/react";
import selectedConnection from "@/redux/connection/selector";
import Image from "next/image";
import { useIntl } from "react-intl";
import style from "./index.module.scss";
import classNames from "classnames";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import ROUTES_PATH from "@/constants/routesPath";

const { SubMenu } = Menu;

const Mobile = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const account = useAddress();
  const { isConnected } = useAppSelector(selectedConnection.getConnection);
  const disconnectWallet = useDisconnect();

  const [visible, setVisible] = useState(false);
  const [visibleAccountMenu, setVisibleAccountMenu] = useState(false);

  const handleOpenMenu = () => setVisible(!visible);
  const handleCloseMenu = () => setVisible(false);
  const handleOpenAccountMenu = () =>
    setVisibleAccountMenu(!visibleAccountMenu);
  const handleCloseAccountMenu = () => setVisibleAccountMenu(false);

  const handleDisconnect = () => {
    setTokenCallApi("");
    Cookies.remove(KEY_STORAGE);
    disconnectWallet();
    dispatch(handleRemoveAddressNetwork({ account }));
    dispatch(handleSetAddressNetwork({}));
    dispatch(handleSetAuthenticationToken({}));
    handleCloseAccountMenu();
  };

  const docsMenus = [
    {
      key: "whitepaper",
      label: intl.formatMessage({ id: "header.docs.whitepaper" }),
      href: "#",
    },
    {
      key: "terms-of-service",
      label: intl.formatMessage({ id: "header.docs.terms.of.service" }),
      href: "#",
    },
    {
      key: "privacy-policy",
      label: intl.formatMessage({ id: "header.docs.privacy.policy" }),
      href: "#",
    },
    {
      key: "faqs",
      label: intl.formatMessage({ id: "header.docs.faqs" }),
      href: "#",
    },
  ];

  const listMenus = [
    {
      label: intl.formatMessage({ id: "header.home" }),
      isLink: true,
      href: "#",
    },
    {
      label: intl.formatMessage({ id: "header.marketplace" }),
      isLink: true,
      href: ROUTES_PATH.MARKETPLACE,
    },
    {
      label: intl.formatMessage({ id: "footer.ecosystem.landing.page" }),
      isLink: true,
      href: "#",
    },
    {
      content: (
        <Menu>
          <SubMenu
            key="docs-menu"
            title={intl.formatMessage({ id: "header.docs" })}
          >
            {docsMenus.map((menuItem) => (
              <Menu.Item key={menuItem.key}>
                <AppLink href={menuItem.href}>{menuItem.label}</AppLink>
              </Menu.Item>
            ))}
          </SubMenu>
        </Menu>
      ),
      isLink: true,
      href: "#",
    },
  ];

  const renderHeaderDrawer = () => {
    return (
      <div className={style.header_menu}>
        <div className={style.close_btn}>
          <Image src={CloseIcon} alt="close icon" onClick={handleCloseMenu} />
        </div>
        <div className="container">
          <div className={style.menu}>
            {listMenus.map((menu, index) => {
              const { href, label, content } = menu;
              return (
                <div key={index} className={style.item}>
                  <AppLink href={href}>{content ?? label}</AppLink>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderAccountDrawer = () => {
    return (
      <div className={style.header_overlay}>
        <div
          className={classNames(
            style.item,
            style.border_bottom_none,
            style.header_overlay__address,
          )}
        >
          <ShortenAddress address={account} />
        </div>
        <AppLink href={ROUTES_PATH.MY_ACCOUNT}>
          <div className={style.item}>
            <span>{intl.formatMessage({ id: "header.user.account" })}</span>
          </div>
        </AppLink>
      </div>
    );
  };

  return (
    <div className={style.mobile_header}>
      {isConnected && (
        <Image
          src={UserIcon}
          className={style.mobile_header__icon}
          onClick={handleOpenAccountMenu}
          alt="user icon"
          height={25}
          width={25}
        />
      )}
      <Image
        src={MenuIcon}
        className={classNames(style.mobile_header__icon, style.menu_icon)}
        onClick={handleOpenMenu}
        alt="menu icon"
      />

      <Drawer
        title={renderHeaderDrawer()}
        open={visible}
        closable={false}
        placement="right"
        className={style.mobile_drawer}
        onClose={handleCloseMenu}
      >
        <div className={style.connect_wallet_mobile}>
          {!isConnected && <ConnectWalletButton />}
        </div>
      </Drawer>

      <Drawer
        title={renderAccountDrawer()}
        open={visibleAccountMenu}
        closable={false}
        placement="right"
        className={classNames(style.mobile_drawer, style.mobile_drawer_account)}
        onClose={handleCloseAccountMenu}
      >
        <ButtonWrapper
          text={
            <div
              className={classNames(style.item, style.border_bottom_none)}
              onClick={handleDisconnect}
            >
              <Image src={DisconnectIcon} alt="disconnect icon" />
              <span className={style.disconnect}>
                {intl.formatMessage({ id: "login.disconnect.wallet" })}
              </span>
            </div>
          }
          variant="default"
          className="app-header__button"
        />
      </Drawer>
    </div>
  );
};

export default Mobile;
