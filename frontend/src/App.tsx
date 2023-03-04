import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getProfile } from './components/auth/auth.api';
import { fetching } from './components/auth/auth.reducer';
import { appEnv } from './config/constants';
import { RootState } from './reducers';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const Login = React.lazy(() => import('src/components/auth/Login'));
const Register = React.lazy(() => import('src/components/auth/Register'));
const Page404 = React.lazy(() => import('src/components/shared/Page404'));
const Dashboard = React.lazy(() => import('src/components/dashboard'));
const Page500 = React.lazy(() => import('./components/dummy/pages/page500/Page500'));
const TheLayout = React.lazy(() => import('./components/containers/TheLayout'));

const App = () => {
  const { token, user } = useSelector((state: RootState) => state.authentication);
  const dispatch = useDispatch();
  useEffect(() => {
    let tempToken = token;
    if (!tempToken) {
      tempToken = localStorage.getItem(appEnv.TOKEN_LABEL);
    }
    if (tempToken) {
      dispatch(fetching());
      dispatch(getProfile());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <>
      <ToastContainer
        position={toast.POSITION.TOP_LEFT}
        className="toastify-container"
        toastClassName="toastify-toast"
      />
      <BrowserRouter>
        <React.Suspense fallback={loading}>
          <Routes>
            <Route path="/" element={<Login />} />          
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard/*" element={<Dashboard/>} />
            <Route path="/*" element={<Page404/>} />
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </>
  );
};

export default App;
