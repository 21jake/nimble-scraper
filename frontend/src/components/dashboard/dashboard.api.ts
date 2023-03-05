import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'src/config/axios-interceptor';
import { IBatch } from 'src/models/batch.model';

export interface IUploadFile {
  file?: File;
}

export const uploadCsv = createAsyncThunk(`upload-file`, async (body: IUploadFile, thunkAPI) => {
  try {
    
    const formData = new FormData();
    formData.append('file', body.file as File);
    const { data } = await axios.post<IBatch>(`file`, formData);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

