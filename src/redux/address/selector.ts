import { Address } from './slice';

const selectedAddress = {
  getAddress: (state: any) => state?.AddressSlice as Address,
};

export default selectedAddress;
