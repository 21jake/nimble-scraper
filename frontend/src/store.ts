import { configureStore } from "@reduxjs/toolkit";
import { appEnv } from "./config/constants";
import reducer from "./reducers";

const store = configureStore({
  reducer,
  devTools: appEnv.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
});

export default store;
