import { createAsyncThunk } from '@reduxjs/toolkit';
import { pickBy } from 'lodash';
import axios from 'src/config/axios-interceptor';
import { IBatch } from 'src/models/batch.model';
import { IKeyword } from 'src/models/keyword.model';

export interface IUploadFile {
  file?: File;
}

const prefix = 'file';

export const uploadCsv = createAsyncThunk(`upload-${prefix}`, async (body: IUploadFile, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append('file', body.file as File);
    const { data } = await axios.post<IBatch>(prefix, formData);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export interface IParams {
  size: number;
  page: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  keyword?: string;
  batchId?: number;
  status?: string;
  timestamp?: number;
}

export const getBatches = createAsyncThunk(`get-all-${prefix}-batches`, async (fields: IParams, thunkAPI) => {
  try {
    const params = pickBy(fields);
    return await axios.get<IBatch[]>(`${prefix}/batches`, { params });
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getKeywords = createAsyncThunk(`get-all-${prefix}-keywords`, async (fields: IParams, thunkAPI) => {
  try {
    const params = pickBy(fields);
    return await axios.get<IKeyword[]>(`${prefix}/keywords`, { params });
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
