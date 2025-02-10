import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface Config {
  general: any;
}

const initialState: Config = {
  general: {},
};

export const ConfigSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    handleSetConfig: (state: Config, action: PayloadAction<any>) => {
      return {
        ...state,
        general: action.payload,
      };
    },
  },
});

export const { handleSetConfig } = ConfigSlice.actions;

export const namespace = "ConfigSlice";

export default ConfigSlice.reducer;
