import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { appEnv } from 'src/config/constants';
import { IUser } from 'src/models/user.model';
import { signup, login, getProfile } from 'src/components/auth/auth.api';

interface IInitialLoginState {
  loading: boolean;
  errorMessage?: string;
  user?: IUser;
  token?: string | null;
  loginSuccess: boolean;
  signupSuccess: boolean;
  getProfileSuccess: boolean;
  isFirstTimeLogin: boolean;
}

const initialState: IInitialLoginState = {
  loading: false,
  errorMessage: undefined,
  user: undefined,
  token: undefined,
  loginSuccess: false,
  signupSuccess: false,
  getProfileSuccess: false,
  isFirstTimeLogin: false
};

const { actions, reducer } = createSlice({
  name: 'authenticationSlice',
  initialState,
  reducers: {
    fetching(state) {
      state.loading = true;
    },

    storeToken: (state, { payload }: PayloadAction<string>) => {
      state.token = payload;
    },
    resetAll(state) {
      state.loading = false;
      state.errorMessage = undefined;
      state.user = undefined;
      state.token = undefined;
      state.loginSuccess = false;
      state.signupSuccess = false;
      state.isFirstTimeLogin = false
    },
    partialReset(state) {
      state.loading = false;
      state.errorMessage = undefined;
      state.loginSuccess = false;
      state.signupSuccess = false;
      state.getProfileSuccess = false;
    },
    logout(state) {
      state.token = undefined;
      state.user = undefined;
      localStorage.removeItem('authentication_token');
    },
  },
  extraReducers: {
    [login.fulfilled.type]: (state, { payload }: PayloadAction<IUser>) => {
      localStorage.setItem(appEnv.TOKEN_LABEL, String(payload.token));
      state.token = payload.token;
      state.user = payload;
      state.loginSuccess = true;
      state.loading = false;
    },
    [login.rejected.type]: (state, { payload }: PayloadAction<any>) => {
      localStorage.removeItem(appEnv.TOKEN_LABEL);
      state.errorMessage = payload?.message;
      state.loading = false;
      state.loginSuccess = false;
    },
    [signup.fulfilled.type]: (state, { payload }: PayloadAction<IUser>) => {
      const { token } = payload;
      localStorage.setItem(appEnv.TOKEN_LABEL, String(token));
      state.token = token;
      state.user = payload;
      state.signupSuccess = true;
      state.loading = false;
      state.isFirstTimeLogin = true;      
    },
    [signup.rejected.type]: (state, { payload }: PayloadAction<any>) => {
      localStorage.removeItem(appEnv.TOKEN_LABEL);
      state.errorMessage = payload?.message;
      state.loading = false;
      state.signupSuccess = false;
    },
    [getProfile.fulfilled.type]: (state, { payload }: PayloadAction<IUser>) => {
      state.user = payload;
      state.getProfileSuccess = true;
      state.errorMessage = undefined;
      state.loading = false;
    },
    [getProfile.rejected.type]: (state, { payload }) => {
      localStorage.removeItem(appEnv.TOKEN_LABEL);
      state.getProfileSuccess = false;
      state.loading = false;
    },
  },
});

export const { fetching, resetAll, storeToken, partialReset, logout } = actions;
export default reducer;
