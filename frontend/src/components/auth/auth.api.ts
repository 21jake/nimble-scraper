import { createAsyncThunk } from "@reduxjs/toolkit";
import { pickBy } from "lodash";
// import axios from 'src/config/axios-interceptor';
import axios from 'src/config/axios-interceptor';

export interface ILogIn {
    username: string;
    password: string;
  }
  
  export interface ISignUp extends ILogIn {
    confirmPassword: string;
  }
  
  export const login = createAsyncThunk(`login`, async (body: ILogIn, thunkAPI) => {
    try {
      const { data } = await axios.post(`login`, pickBy(body));
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  });


  export const signup = createAsyncThunk(`signup`, async (body: ISignUp, thunkAPI) => {
    try {
      const { data } = await axios.post(`signup`, pickBy(body));
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  });
  