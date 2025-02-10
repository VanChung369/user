import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface Authentication {
  authenticationToken: string;
  authenticationTokenRefesh: string;
}

const initialState: Authentication = {
  authenticationToken: '',
  authenticationTokenRefesh: '',
};

export const AuthenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    handleSetAuthenticationToken: (state: Authentication, action: PayloadAction<any>) => {
      const { token, refreshToken } = action.payload;

      return {
        ...state,
        authenticationToken: token,
        authenticationTokenRefesh: refreshToken,
      };
    },
  },
});

export const { handleSetAuthenticationToken } = AuthenticationSlice.actions;

export const namespace = 'AuthenticationSlice';

export default AuthenticationSlice.reducer;
