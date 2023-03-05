import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { login } from 'src/components/auth/auth.api';
import { IBatch } from 'src/models/batch.model';
import { uploadCsv } from './dashboard.api';

interface IInitialFileUploadState {
  loading: boolean;
  uploadSuccess: boolean;
  batch?: IBatch;
  errorMessage?: string | null;
}

const initialState: IInitialFileUploadState = {
  loading: false,
  uploadSuccess: false,
  errorMessage: undefined,
  batch: undefined,
};

const { actions, reducer } = createSlice({
  name: 'fileUploadSlice',
  initialState,
  reducers: {
    fetching(state) {
      state.loading = true;
    },

    resetAll(state) {
      state.loading = false;
      state.uploadSuccess = false;
      state.errorMessage = undefined;
      state.batch = undefined;
    },
  },
  extraReducers: {
    [uploadCsv.fulfilled.type]: (state, { payload }: PayloadAction<IBatch>) => {
      state.loading = false;
      state.uploadSuccess = true;
      state.batch = payload;
    },
    [login.rejected.type]: (state, { payload }: PayloadAction<any>) => {
      state.errorMessage = payload?.message;
      state.loading = false;
      state.uploadSuccess = false;
    },
  },
});

export const { fetching, resetAll } = actions;
export default reducer;
