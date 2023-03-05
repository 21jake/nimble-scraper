import { combineReducers } from 'redux';
import authentication from 'src/components/auth/auth.reducer';
import dashboard from 'src/components/dashboard/dashboard.reducer';

const rootReducer = combineReducers({ authentication, dashboard });

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
