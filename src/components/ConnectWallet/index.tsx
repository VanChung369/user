import { SUPPORTED_CHAIN_IDS } from "@/constants/connect";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useConnectWallet } from "@/hooks/hook-customs/useConnectWallet";
import { useGetAppConfig } from "@/hooks/hook-customs/useGetAppConfig";
import selectedAddress from "@/redux/address/selector";
import {
  handleAddAddressNetWork,
  handleRemoveAddressNetwork,
  handleSetAddressNetwork,
} from "@/redux/address/slice";
import selectAuthentication from "@/redux/authentication/selector";
import { handleSetAuthenticationToken } from "@/redux/authentication/slice";
import {
  handleSetConnected,
  handleSetConnectModal,
  handleSetLoadingMetamask,
  handleSetWrongNetwork,
} from "@/redux/connection/slice";
import { setTokenCallApi } from "@/utils/api";
import {
  useAddress,
  useChainId,
  useConnectionStatus,
  useDisconnect,
  useSigner,
} from "@thirdweb-dev/react";
import { FC, Fragment, useEffect } from "react";
import ModalWrongNetwork from "../ModalWrongNetwork";
import ModalConnectWallet from "../ModalConnectWallet";
import selectedConnection from "@/redux/connection/selector";
import MetamaskService from "@/services/blockchain";
import { useLogin } from "./hook";
import formatMessage from "@/components/FormatMessage";
import { useIntl } from "react-intl";

const ConnectWalletWrapper: FC<{
  children: any;
}> = ({ children }) => {
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const connectionStatus = useConnectionStatus();
  const chainId = useChainId();
  const account = useAddress();
  const signer = useSigner();

  const disconnectWallet = useDisconnect();
  const { handleConnect } = useConnectWallet();
  const { onLogin } = useLogin();

  const { address, listAddress } = useAppSelector(selectedAddress.getAddress);
  const { authenticationToken } = useAppSelector(
    selectAuthentication.getAuthenticationToken
  );
  const { isConnectingWallet } = useAppSelector(
    selectedConnection.getConnection
  );

  useGetAppConfig();

  useEffect(() => {
    if (authenticationToken && connectionStatus === "disconnected") {
      handleConnect();
    }

    if (!authenticationToken && connectionStatus === "disconnected") {
      handleDisconnect();
    }
  }, [authenticationToken, connectionStatus]);

  useEffect(() => {
    const isWrongNetwork =
      authenticationToken && chainId && !SUPPORTED_CHAIN_IDS.includes(chainId);
    dispatch(handleSetWrongNetwork(isWrongNetwork));

    if (!isWrongNetwork)
      dispatch(
        handleSetAddressNetwork({
          chainId,
          address: address,
        })
      );
  }, [authenticationToken, chainId]);

  useEffect(() => {
    const setUpAddress = async () => {
      if (account) {
        const wallet = new MetamaskService().getInstance();
        const isAdmin = await handleCheckIsAdmin(wallet);

        if (!isAdmin) {
          if (!listAddress?.[account]) {
            handleLoginForFirstTime(wallet);
          } else {
            handleLoginWithExistedAccount(account);
          }
        }
      }
    };

    if (account !== address || !address || !authenticationToken) {
      setUpAddress();
    }
  }, [account]);

  const handleCheckIsAdmin = async (wallet: MetamaskService) => {
    const isAdmin = await wallet.isAdmin(account as string);
    if (isAdmin) {
      handleCancelLoadingMetamask();
      handleLoginFailed();
    }
    return isAdmin;
  };

  useEffect(() => {
    if (address && account) {
      dispatch(handleSetConnected(true));
    } else {
      dispatch(handleSetConnected(false));
    }
  }, [address, account]);

  const handleCancelLoadingMetamask = () =>
    setTimeout(() => {
      dispatch(handleSetConnectModal(false));
    }, 1000);

  const handleDisconnect = () => {
    disconnectWallet();
    dispatch(handleRemoveAddressNetwork({ account }));
    dispatch(handleSetAddressNetwork({}));
    dispatch(handleSetAuthenticationToken({}));
    setTokenCallApi("");
  };

  const handleLoginFailed = () => {
    handleDisconnect();
    dispatch(handleSetLoadingMetamask(false));

    formatMessage({
      msgContent: intl.formatMessage({ id: "codeMessage.E2" }),
      type: "error",
    });
  };

  const handleLoginForFirstTime = async (wallet: MetamaskService) => {
    const signature = (await wallet.verifyLoginSignature({
      signer,
      creator: account as string,
      cancelMetamask: () => {
        handleDisconnect();
        handleCancelLoadingMetamask();
      },
    })) as string;

    if (signature) {
      await handleLogin({
        address: account as string,
        signature,
        success: async () => {
          dispatch(
            handleAddAddressNetWork({
              address: account,
              signature,
            })
          );
          dispatch(
            handleSetAddressNetwork({
              chainId,
              address: account,
            })
          );
          dispatch(handleSetLoadingMetamask(false));
        },
        fail: handleLoginFailed,
      });
    }
  };

  const handleLoginWithExistedAccount = async (account: string) => {
    handleLogin({
      address: account as string,
      signature: listAddress?.[account]?.signature as string,
      success: async () => {
        dispatch(
          handleSetAddressNetwork({
            chainId,
            address: account,
          })
        );
        dispatch(handleSetLoadingMetamask(false));
      },
      fail: handleLoginFailed,
    });
  };

  const handleLogin = async ({
    address,
    signature,
    success,
    fail,
  }: {
    address: string;
    signature: string;
    success: () => void;
    fail: () => void;
  }) => {
    const data = {
      address,
      signature,
    };

    try {
      onLogin({ data: data, onSuccess: success, onError: fail });
    } catch (error) {
    } finally {
      handleCancelLoadingMetamask();
    }
  };

  return (
    <Fragment>
      {children}
      <ModalWrongNetwork />
      <ModalConnectWallet />
    </Fragment>
  );
};

export default ConnectWalletWrapper;
