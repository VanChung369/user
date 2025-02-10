import { useAppDispatch } from "@/hooks";
import { handleSetConnectModal } from "@/redux/connection/slice";
import classNames from "classnames";
import { useIntl } from "react-intl";
import ButtonWrapper from "../ButtonWrapper";
import styles from "./index.module.scss";

type ConnectWalletButtonProps = { className?: string };

const ConnectWalletButton = ({ className }: ConnectWalletButtonProps) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const handleShowConnectModal = () => dispatch(handleSetConnectModal(true));

  return (
    <ButtonWrapper
      text={intl.formatMessage({ id: "login.connectwallet" })}
      onClick={handleShowConnectModal}
      className={classNames(styles.connect__button, className)}
    />
  );
};

export default ConnectWalletButton;
