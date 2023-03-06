import { createEntityAdapter, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { IBatch } from 'src/models/batch.model';
import { IKeyword } from 'src/models/keyword.model';
import { RootState } from 'src/reducers';
import { uploadCsv, getBatches, getKeywords } from './dashboard.api';

interface IInitialFileUploadState {
  loading: boolean;
  uploadSuccess: boolean;
  batch?: IBatch;
  errorMessage?: string | null;
  fetchEntitiesSuccess: boolean;
  totalItems: number;
  cacheBatches: IBatch[];
  streaming: boolean;
}

interface IResponse<T> {
  count: number;
  results: T;
}

const initialState: IInitialFileUploadState = {
  loading: false,
  uploadSuccess: false,
  errorMessage: undefined,
  batch: undefined,
  fetchEntitiesSuccess: false,
  totalItems: 0,
  cacheBatches: [],
  streaming: false,

};

export const dashboardAdapter = createEntityAdapter<IBatch | IKeyword>({
  selectId: ({ id }) => id,
});

const { actions, reducer } = createSlice({
  name: 'dashboardSlice',
  initialState: dashboardAdapter.getInitialState({ initialState }),
  reducers: {
    fetching(state) {
      state.initialState.loading = true;
    },
    resetAll(state) {
      state.initialState.loading = false;
      state.initialState.uploadSuccess = false;
      state.initialState.errorMessage = undefined;
      state.initialState.batch = undefined;
      state.initialState.fetchEntitiesSuccess = false;
      state.initialState.totalItems = 0;
      state.initialState.cacheBatches = [];
      state.initialState.streaming = false;
    },
    setKwProcessedCount(state, {payload}: PayloadAction<number>) {
      if (!state.initialState.batch) return;
      state.initialState.batch.processedCount = payload;
    },
    streaming(state, {payload}: PayloadAction<boolean>) {
      state.initialState.streaming = payload;
    },
 
  },
  extraReducers: {
    [uploadCsv.fulfilled.type]: (state, { payload }: PayloadAction<IBatch>) => {
      state.initialState.loading = false;
      state.initialState.uploadSuccess = true;
      state.initialState.batch = payload;
    },
    [uploadCsv.rejected.type]: (state, { payload }: PayloadAction<any>) => {
      state.initialState.errorMessage = payload?.message;
      state.initialState.loading = false;
      state.initialState.uploadSuccess = false;
    },
    [getBatches.fulfilled.type]: (state, { payload }: PayloadAction<AxiosResponse<IResponse<IBatch[]>>>) => {
      dashboardAdapter.setAll(state, payload.data.results);
      state.initialState.totalItems = Number(payload.data.count);
      state.initialState.fetchEntitiesSuccess = true;
      state.initialState.loading = false;
      state.initialState.cacheBatches = payload.data.results;
    },
    [getBatches.rejected.type]: (state, { payload }: PayloadAction<any>) => {
      state.initialState.errorMessage = payload?.message;
      state.initialState.loading = false;
      state.initialState.fetchEntitiesSuccess = false;
    },
    [getKeywords.fulfilled.type]: (state, { payload }: PayloadAction<AxiosResponse<IResponse<IKeyword[]>>>) => {
      dashboardAdapter.setAll(state, payload.data.results);
      state.initialState.totalItems = Number(payload.data.count);
      state.initialState.fetchEntitiesSuccess = true;
      state.initialState.loading = false;
    },
    [getKeywords.rejected.type]: (state, { payload }: PayloadAction<any>) => {
      state.initialState.errorMessage = payload?.message;
      state.initialState.loading = false;
      state.initialState.fetchEntitiesSuccess = false;
    },
  },
});

export const { fetching, resetAll, setKwProcessedCount, streaming} = actions;

export const dashboardSelectors = dashboardAdapter.getSelectors<RootState>((state) => state.dashboard);

const { selectById } = dashboardAdapter.getSelectors();

const getFilesState = (rootState: RootState) => rootState.dashboard;

export const selectEntityById = (id: string) => {
  return createSelector(getFilesState, (state) => selectById(state, id));
};

export default reducer;
