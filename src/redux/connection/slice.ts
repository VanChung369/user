import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface Connection {
  isConnectingWallet: boolean;
  isShowConnectModal: boolean;
  isWrongNetwork: boolean;
  isConnected: boolean;
}

const initialState: Connection = {
  isConnectingWallet: false,
  isShowConnectModal: false,
  isWrongNetwork: false,
  isConnected: false,
};

export const ConnectionSlice = createSlice({
  name: "connection",
  initialState,
  reducers: {
    handleSetConnectModal: (
      state: Connection,
      action: PayloadAction<boolean>
    ) => {
      return {
        ...state,
        isShowConnectModal: action.payload,
      };
    },

    handleSetLoadingMetamask: (
      state: Connection,
      action: PayloadAction<boolean>
    ) => {
      return {
        ...state,
        isConnectingWallet: action.payload,
      };
    },

    handleSetWrongNetwork: (state: Connection, action: PayloadAction<any>) => {
      return {
        ...state,
        isWrongNetwork: action.payload,
      };
    },
    handleSetConnected: (state: Connection, action: PayloadAction<any>) => {
      return {
        ...state,
        isConnected: action.payload,
      };
    },
  },
});

export const {
  handleSetConnectModal,
  handleSetWrongNetwork,
  handleSetLoadingMetamask,
  handleSetConnected,
} = ConnectionSlice.actions;

export const namespace = "ConnectionSlice";

export default ConnectionSlice.reducer;
