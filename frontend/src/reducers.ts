import { combineReducers } from 'redux';
import container from 'src/components/containers/reducer';
import authentication from 'src/components/auth/auth.reducer';
import fileUpload from 'src/components/dashboard/dashboard.reducer';

const rootReducer = combineReducers({ container, authentication, fileUpload });

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
