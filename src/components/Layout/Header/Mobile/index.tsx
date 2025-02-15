import { Drawer, Menu } from "antd";
import Cookies from "js-cookie";
import CloseIcon from "@public/svg/close-icon.svg";
import DisconnectIcon from "@public/svg/disconnect-icon.svg";
import MenuIcon from "@public/svg/menu-icon.svg";
import UserIcon from "@public/images/no-profile-md.png";
import { Fragment, useState } from "react";
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
import AddToWallet from "@/components/AddToWallet";
import { WALLET_TYPE } from "@/constants/wallet";
import Image from "next/image";

const { SubMenu } = Menu;

const Mobile = () => {
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
      label: "whitepaper",
      href: "#",
    },
    {
      key: "terms-of-service",
      label: "terms-of-service",
      href: "#",
    },
    {
      key: "privacy-policy",
      label: "privacy-policy",
      href: "#",
    },
    {
      key: "faqs",
      label: "faqs",
      href: "#",
    },
  ];

  const listMenus = [
    {
      label: "home",
      isLink: true,
      href: "",
    },
    {
      label: "landing page",
      isLink: true,
      href: "#",
    },
    {
      content: (
        <Menu mode="inline">
          <SubMenu key="docs-menu" title={"docs"}>
            {docsMenus.map((menuItem, index) => (
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
      <div className="header-menu">
        <div className="close-btn">
          <Image src={CloseIcon} alt="close icon" onClick={handleCloseMenu} />
        </div>
        <div className="container">
          <div className="menu">
            {listMenus.map((menu, index) => {
              const { href, label, content } = menu;
              return (
                <div key={index} className="item">
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
      <div className="header-overlay">
        <div className="account-button">
          <div className="item header-overlay__address border-bottom-none">
            <ShortenAddress address={account} />
          </div>
        </div>
        <AppLink href={"#"}>
          <div className="item">
            <span>account</span>
          </div>
        </AppLink>
        <AppLink href={"#"}>
          <div className="item">
            <span>inventory</span>
          </div>
        </AppLink>
        <AppLink href={"#"}>
          <div className="item">
            <span>redemption</span>
          </div>
        </AppLink>
        <AppLink href={"#"}>
          <div className="item">
            <span>history</span>
          </div>
        </AppLink>
      </div>
    );
  };

  return (
    <div className="mobile-header">
      {isConnected && (
        <Image
          src={UserIcon}
          className="mobile-header__icon"
          onClick={handleOpenAccountMenu}
          alt={"user icon"}
        />
      )}
      <Image
        src={MenuIcon}
        className="mobile-header__icon menu-icon"
        onClick={handleOpenMenu}
        alt={"menu icon"}
      />

      <Drawer
        title={renderHeaderDrawer()}
        open={visible}
        closable={false}
        placement="right"
        className="mobile-drawer"
        onClose={handleCloseMenu}
      >
        <div className="connect-wallet-mobile">
          {!isConnected && (
            <AddToWallet
              className="connect-wallet-mobile"
              walletType={WALLET_TYPE.METAMASK}
              text={
                <Fragment>
                  <span>{"conncet metamask"}</span>
                </Fragment>
              }
            />
          )}
        </div>
      </Drawer>

      <Drawer
        title={renderAccountDrawer()}
        open={visibleAccountMenu}
        closable={false}
        placement="right"
        className="mobile-drawer mobile-drawer_account"
        onClose={handleCloseAccountMenu}
      >
        <ButtonWrapper
          text={
            <div className="item border-bottom-none" onClick={handleDisconnect}>
              <Image src={DisconnectIcon} alt={"disconnect icon"} />
              <span className="disconnect">disconnect</span>
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
