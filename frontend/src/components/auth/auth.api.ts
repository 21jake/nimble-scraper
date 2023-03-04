import { createAsyncThunk } from "@reduxjs/toolkit";
import { pickBy } from "lodash";
// import axios from 'src/config/axios-interceptor';
import axios from 'src/config/axios-interceptor';

export interface ILogin {
    username: string;
    password: string;
  }
  
  export interface ISignup extends ILogin {
    confirmPassword: string;
  }
  
  export const login = createAsyncThunk(`login`, async (body: ILogin, thunkAPI) => {
    try {
      const { data } = await axios.post(`login`, pickBy(body));
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  });


  export const signup = createAsyncThunk(`signup`, async (body: ISignup, thunkAPI) => {
    try {
      const { data } = await axios.post(`signup`, pickBy(body));
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  });

  export const getProfile = createAsyncThunk(`profile`, async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`profile`);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  });