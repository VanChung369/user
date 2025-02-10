import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { omit } from 'lodash';

export interface Address {
  address: string;
  chainId: number | null;
  listAddress: any;
}

const initialState: Address = {
  address: '',
  chainId: null,
  listAddress: {},
};

export const AddressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    handleSetAddressNetwork: (state: Address, action: PayloadAction<any>) => {
      const { address, chainId } = action.payload;
      return {
        ...state,
        address,
        chainId,
      };
    },

    handleRemoveAddressNetwork: (state: Address, action: PayloadAction<any>) => {
      const { address } = action.payload;
      return {
        ...state,
        listAddress: omit(state?.listAddress, [address]),
        address: '',
        chainId: null,
      };
    },

    handleAddAddressNetWork: (state: Address, action: PayloadAction<any>) => {
      const { address, signature, startTime, expiredTime } = action.payload;
      return {
        ...state,
        listAddress: {
          ...state.listAddress,
          [address]: {
            address,
            signature,
            startTime,
            expiredTime,
          },
        },
      };
    },
  },
});

export const { handleSetAddressNetwork, handleAddAddressNetWork, handleRemoveAddressNetwork } =
  AddressSlice.actions;

export const namespace = 'AddressSlice';

export default AddressSlice.reducer;
