import {
  BUY_STEPS,
  LIST_FOR_SALE_STEPS,
  REMOVE_FROM_SALE_STEPS,
} from "@/constants/nft";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const { START: startBuy } = BUY_STEPS;
const { START: startListForSale } = LIST_FOR_SALE_STEPS;
const { START: startRemoveFromSale } = REMOVE_FROM_SALE_STEPS;

export interface Action {
  buyStep?: number;
  listForSaleStep?: number;
  removeFromSaleStep?: number;
  transactionHash?: string;
  transactionId?: string;
}

const initialState: Action = {
  buyStep: startBuy,
  listForSaleStep: startListForSale,
  removeFromSaleStep: startRemoveFromSale,
  transactionHash: "",
  transactionId: "",
};

export const ActionSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    handleSetBuyStep: (state: Action, action: PayloadAction<any>) => {
      return {
        ...state,
        buyStep: action.payload,
      };
    },

    handleSetListForSaleStep: (state: Action, action: PayloadAction<any>) => {
      return {
        ...state,
        listForSaleStep: action.payload,
      };
    },

    handleSetRemoveFromSaleStep: (
      state: Action,
      action: PayloadAction<any>
    ) => {
      return {
        ...state,
        removeFromSaleStep: action.payload,
      };
    },

    handleSetTransactionHash: (state: Action, action: PayloadAction<any>) => {
      return {
        ...state,
        transactionHash: action.payload,
      };
    },

    handleSetTransactionId: (state: Action, action: PayloadAction<any>) => {
      return {
        ...state,
        transactionId: action.payload,
      };
    },
  },
});

export const {
  handleSetBuyStep,
  handleSetListForSaleStep,
  handleSetRemoveFromSaleStep,
  handleSetTransactionHash,
  handleSetTransactionId,
} = ActionSlice.actions;

export const namespace = "ActionSlice";

export default ActionSlice.reducer;
