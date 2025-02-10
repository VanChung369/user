import { Authentication } from './slice';

const selectAuthentication = {
  getAuthenticationToken: (state: any) => state?.AuthenticationSlice as Authentication,
};

export default selectAuthentication;
