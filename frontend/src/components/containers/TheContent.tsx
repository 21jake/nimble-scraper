import { CContainer } from '@coreui/react-pro';
import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import routes from '../../routes';
import Lost from '../dummy/pages/page404/Page404';


const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const TheContent = () => {
  return (
    <CContainer fluid className="px-0">
      <Suspense fallback={loading}>
        <Routes>
          {routes.map((route, idx) => (
            <Route key={idx} path={route.path} element={<route.component />} />
          ))}
          {/* <Route path="*" element={<Navigate to="/" />} /> */}
          <Route path="*" element={<Lost/>} />

        </Routes>
      </Suspense>
    </CContainer>
  );
};

export default React.memo(TheContent);
