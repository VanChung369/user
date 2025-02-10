import { FC } from "react";
import style from "./index.module.scss";
import { AddToWalletProps } from "./typings";
import { Button } from "antd";
import classNames from "classnames";
import MetaMaskLogo from "@public/svg/Metamask.svg";
import WalletConnectLogo from "@public/svg/WalletConnect.svg";
import CoinBaseLogo from "@public/svg/Coinbase.svg";
import NextIcon from "@public/svg/next-icon-white.svg";
import { WALLET_TYPE } from "@/constants/wallet";

const AddToWallet: FC<AddToWalletProps> = ({
  afterIcon,
  className,
  text,
  href,
  walletType,
  ...props
}) => {
  let wallet: any = MetaMaskLogo;

  switch (walletType) {
    case WALLET_TYPE.METAMASK:
      wallet = MetaMaskLogo;
      break;
    case WALLET_TYPE.COIN_BASE:
      wallet = CoinBaseLogo;
      break;
    case WALLET_TYPE.WALLET_CONNECT:
      wallet = WalletConnectLogo;
      break;
  }

  return (
    <div className={style.button}>
      <Button
        className={classNames(className, style.button__content)}
        {...props}
      >
        <div>
          <img src={wallet.src} className={style.button__icon} />
          <span className={style.button__text}>{text}</span>
        </div>
        <img src={NextIcon.src} className={style.button__icon} />
        {afterIcon}
      </Button>
    </div>
  );
};

export default AddToWallet;
