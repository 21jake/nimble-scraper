import { combineReducers } from 'redux';
import container from './components/containers/reducer';

const rootReducer = combineReducers({ container });

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
