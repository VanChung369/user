import { NFT_STANDARD, NFT_TRANSACTION_STATUS } from "@/constants/nft";
import { WALLET_STATUS } from "@/constants/wallet";
import { ThirdwebSDK, TransactionError } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import { AddressZero } from "@ethersproject/constants";
import { formatUnits } from "ethers/lib/utils";
import { checkEnoughBalance, convertEToNumber } from "@/utils/contract";
import BigNumber from "bignumber.js";
import { MAX_ALLOWANCE } from "@/constants";

const { SUCCESS, FAILED } = NFT_TRANSACTION_STATUS;

const sdk = new ThirdwebSDK(Number(process.env.NEXT_PUBLIC_APP_CHAIN_ID));

export function isNativeToken(address: string) {
  return address === AddressZero;
}
export default class Wallet {
  address: string | null;

  constructor(props: any) {
    this.address = props?.address;
  }

  isAdmin = async (_account: string) => {
    try {
      const contract = await sdk.getContract(
        process.env.NEXT_PUBLIC_PROXY_ADDRESS!
      );

      return await contract.call("isAdmin", [_account]);
    } catch (error) {
      return false;
    }
  };

  verifyLoginSignature = async ({
    signer,
    creator,
    cancelMetamask,
  }: {
    signer: any;
    creator: string;
    cancelMetamask: () => void;
  }) => {
    let signVerify: any = null;
    let hasnVerify = null;

    try {
      hasnVerify = ethers.utils.solidityKeccak256(["address"], [creator]);

      const signHashBytes = ethers.utils.arrayify(hasnVerify);

      if (!signer) {
        throw new Error("No signer found");
      }

      signVerify = await signer.signMessage(signHashBytes);

      return signVerify;
    } catch (error: any) {
      console.log("error : ", error);
      if (WALLET_STATUS.CANCEL_METAMASK === error?.code) {
        cancelMetamask && cancelMetamask();
      } else {
      }
    }
  };

  buyNFT = async ({
    signer,
    data,
    onCancelMetamask,
    onCallback,
    onServerError,
    onContractError,
    isSecondary,
    onUpdateTransactionHash,
  }: {
    signer: any;
    data?: Array<any> | any;
    onCancelMetamask?: () => void;
    onCallback?: (data?: any) => void;
    onServerError?: () => void;
    onContractError?: (data: any) => void;
    isSecondary?: boolean;
    onUpdateTransactionHash?: (hash: string) => void;
  }) => {
    const sdkSigner = ThirdwebSDK.fromSigner(
      signer,
      Number(process.env.NEXT_PUBLIC_APP_CHAIN_ID)
    );
    const contract = await sdkSigner.getContract(
      process.env.NEXT_PUBLIC_PROXY_ADDRESS!
    );

    let response;

    try {
      if (!isSecondary) {
        response = await contract.call("handleMintRequest", [...data]);
      } else {
        response = await contract.call("handleBuyRequest", [...data]);
      }

      if (response?.receipt?.blockHash) {
        if (isSecondary) {
          onUpdateTransactionHash &&
            onUpdateTransactionHash(response?.receipt?.transactionHash);
        }
        if (response?.receipt?.status) {
          onCallback &&
            onCallback({
              hash: response?.receipt?.transactionHash,
              status: SUCCESS,
            });
        } else {
          onContractError &&
            onContractError({
              hash: response?.receipt?.transactionHash,
              status: FAILED,
            });
        }
      }
    } catch (error: any) {
      console.log("Execution buyNFT reverted with reason:", error);
      if (WALLET_STATUS.CANCEL_METAMASK === error?.code) {
        onCancelMetamask && onCancelMetamask();
      } else {
        onContractError &&
          onContractError({
            hash: response?.receipt?.blockHash,
            status: FAILED,
            message: JSON.stringify(error),
          });
        onServerError && onServerError();
      }
    }
  };

  getBalance = async ({
    signer,
    tokenAddress,
    address,
    currencyDecimal,
  }: {
    signer: any;
    tokenAddress: string;
    address: string;
    currencyDecimal?: number;
  }) => {
    try {
      if (address) {
        let tokenInst, balance, balanceFlat, decimals;
        if (isNativeToken(tokenAddress)) {
          balance = await signer.getBalance(address);
          balanceFlat = formatUnits(balance, "wei");
          decimals = currencyDecimal;
        } else {
          tokenInst = await sdk.getContract(process.env.NEXT_PUBLIC_ERC_20!);

          balance = await tokenInst.call("balanceOf", [address]);
          balanceFlat = formatUnits(balance, "wei");
          decimals = await tokenInst.call("decimals");
        }

        return {
          balance: convertEToNumber(balanceFlat, decimals),
        };
      }

      return {
        balance: 0,
      };
    } catch (e) {
      console.log("Execution getBalance reverted with reason:", e);
      return {
        balance: 0,
      };
    }
  };

  checkBuyerBalance = async ({
    signer,
    address,
    tokenAddress,
    price,
    quantity,
  }: {
    signer: any;
    address: string;
    tokenAddress: string;
    price: any;
    quantity: number;
  }) => {
    const balances = await this.getBalance({ signer, address, tokenAddress });
    const balance = balances.balance;
    return checkEnoughBalance(price, quantity, balance);
  };

  getAllowanceERC20 = async ({ account }: { account?: string }) => {
    try {
      const contract = await sdk.getContract(process.env.NEXT_PUBLIC_ERC_20!);
      const response = await contract.call("allowance", [
        account,
        process.env.NEXT_PUBLIC_PROXY_ADDRESS!,
      ]);
      return new BigNumber(response.toString());
    } catch (e) {
      console.log("Execution getAllowanceERC20 reverted with reason:", e);
      return 0;
    }
  };

  setAllowanceERC20 = async ({
    signer,
    onSuccess,
    onError,
    onCancelMetamask,
  }: {
    signer?: any;
    onCancelMetamask?: () => void;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    try {
      const sdkSigner = ThirdwebSDK.fromSigner(
        signer,
        Number(process.env.NEXT_PUBLIC_APP_CHAIN_ID)
      );
      const contract = await sdkSigner.getContract(
        process.env.NEXT_PUBLIC_ERC_20!
      );
      const response = await contract.call("increaseAllowance", [
        process.env.NEXT_PUBLIC_PROXY_ADDRESS!,
        MAX_ALLOWANCE,
      ]);

      if (response?.receipt?.blockHash) {
        if (response?.receipt?.status) {
          onSuccess && onSuccess();
        } else {
          return;
        }
      }
    } catch (error: any) {
      console.log("Execution setAllowanceERC20 reverted with reason:", error);
      if (WALLET_STATUS.CANCEL_METAMASK === error?.code) {
        onCancelMetamask && onCancelMetamask();
      } else {
        onError && onError();
      }
    }
  };

  checkListForSaleNftApproved = async ({ account, standard }: any) => {
    try {
      const contract = await sdk.getContract(
        standard === NFT_STANDARD[0].value
          ? process.env.NEXT_PUBLIC_ERC_721!
          : process.env.NEXT_PUBLIC_ERC_1155!
      );
      const response = await contract.call("isApprovedForAll", [
        account,
        process.env.NEXT_PUBLIC_PROXY_ADDRESS!,
      ]);

      return response;
    } catch (e) {
      console.log(
        "Execution checkListForSaleNftApproved reverted with reason:",
        e
      );
      console.error(e);
    }
  };

  setListForSaleNftApproved = async ({
    signer,
    approved,
    standard,
    onSuccess,
    onCancelMetamask,
    onError,
  }: {
    signer?: any;
    onCancelMetamask?: () => void;
    onSuccess?: () => void;
    onError?: () => void;

    approved?: boolean;
    standard?: string | number;
  }) => {
    try {
      const sdkSigner = ThirdwebSDK.fromSigner(
        signer,
        Number(process.env.NEXT_PUBLIC_APP_CHAIN_ID)
      );
      const contract = await sdkSigner.getContract(
        standard === NFT_STANDARD[0].value
          ? process.env.NEXT_PUBLIC_ERC_721!
          : process.env.NEXT_PUBLIC_ERC_1155!
      );

      const response = await contract.call("setApprovalForAll", [
        process.env.NEXT_PUBLIC_PROXY_ADDRESS!,
        approved,
      ]);
      if (response?.receipt?.blockHash) {
        if (response?.receipt?.status) {
          onSuccess && onSuccess();
        } else {
          return;
        }
      }
    } catch (error: any) {
      console.log(
        "Execution setListForSaleNftApproved reverted with reason:",
        error
      );
      if (WALLET_STATUS.CANCEL_METAMASK === error?.code) {
        onCancelMetamask && onCancelMetamask();
      } else {
        onError && onError();
      }
    }
  };

  cancelSellOrder = async ({
    signer,
    data,
    onCancelMetamask,
    onCallback,
    onServerError,
    onContractError,
  }: {
    signer?: any;
    data?: Array<any> | any;
    onCancelMetamask?: () => void;
    onCallback?: (hash?: any) => void;
    onServerError?: () => void;
    onContractError?: (data: any) => void;
  }) => {
    const sdkSigner = ThirdwebSDK.fromSigner(
      signer,
      Number(process.env.NEXT_PUBLIC_APP_CHAIN_ID)
    );
    const contract = await sdkSigner.getContract(
      process.env.NEXT_PUBLIC_PROXY_ADDRESS!
    );

    let response;
    try {
      response = await contract.call("handleCancelOrder", [...data]);

      if (response?.receipt?.blockHash) {
        if (response?.receipt?.status) {
          onCallback &&
            onCallback({
              hash: response?.receipt?.transactionHash,
              status: NFT_TRANSACTION_STATUS.SUCCESS,
            });
        } else {
          onContractError &&
            onContractError({
              hash: response?.receipt?.transactionHash,
              status: NFT_TRANSACTION_STATUS.FAILED,
            });
        }
      }
    } catch (error: any) {
      console.log("Cancel sell order error:", error);
      if (WALLET_STATUS.CANCEL_METAMASK === error?.code) {
        onCancelMetamask && onCancelMetamask();
      } else {
        onContractError &&
          onContractError({
            hash: response?.receipt?.blockHash,
            status: FAILED,
            message: JSON.stringify(error),
          });
        onServerError && onServerError();
      }
    }
  };
}
