import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import instance from './config/axios-interceptor';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const Login = React.lazy(() => import('./components/dummy/pages/login/Login'));
const Register = React.lazy(() => import('./components/dummy/pages/register/Register'));
const Page404 = React.lazy(() => import('./components/dummy/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./components/dummy/pages/page500/Page500'));
const TheLayout = React.lazy(() => import('./components/containers/TheLayout'));

const App = () => {
  instance.get('/users').then((res) => {
    console.log(res)
    return res
  })

  return (
    <HashRouter>
      <React.Suspense fallback={loading}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/500" element={<Page500 />} />
          <Route path="/404" element={<Page404 />} />
          <Route path="*" element={<TheLayout />} />
        </Routes>
      </React.Suspense>
    </HashRouter>
  );
};

export default App;
