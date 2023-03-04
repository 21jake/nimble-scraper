import { combineReducers } from 'redux';
import container from 'src/components/containers/reducer';
import authentication from 'src/components/auth/auth.reducer';

const rootReducer = combineReducers({ container, authentication });

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
