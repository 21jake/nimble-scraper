import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { appEnv } from 'src/config/constants';
import { IUser } from 'src/models/user.model';
import { signup, login } from 'src/components/auth/auth.api';

interface IInitialLoginState {
  loading: boolean;
  errorMessage?: string;
  user?: IUser;
  token?: string;
  loginSuccess: boolean;
  signupSuccess: boolean;
}

const initialState: IInitialLoginState = {
  loading: false,
  errorMessage: undefined,
  user: undefined,
  token: undefined,
  loginSuccess: false,
  signupSuccess: false,
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
    },
  },
  extraReducers: {
    [login.fulfilled.type]: (state, { payload }: PayloadAction<{ id_token: string }>) => {
      localStorage.setItem(appEnv.TOKEN_LABEL, payload.id_token);
      state.token = payload.id_token;
      state.loginSuccess = true;
      state.loading = false;
    },
    [login.rejected.type]: (state, { payload }: PayloadAction<any>) => {
      localStorage.removeItem(appEnv.TOKEN_LABEL);
      state.errorMessage = payload?.message;
      state.loading = false;
      state.loginSuccess = false;
    },
    [signup.fulfilled.type]: (state, { payload }: PayloadAction<{ token: string }>) => {
      localStorage.setItem(appEnv.TOKEN_LABEL, payload.token);
      state.token = payload.token;
      state.signupSuccess = true;
      state.loading = false;
    },
    [signup.rejected.type]: (state, { payload }: PayloadAction<any>) => {
      localStorage.removeItem(appEnv.TOKEN_LABEL);
      state.errorMessage = payload?.message;
      state.loading = false;
      state.signupSuccess = false;
    },
  },
});

export const { fetching, resetAll, storeToken } = actions;
export default reducer;
