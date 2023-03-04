import { CContainer } from '@coreui/react-pro';
import React, { Suspense, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { RootState } from 'src/reducers';
import { useRouter } from 'src/utils/hooks';
import TheHeader from '../containers/TheHeader';

const Overview = React.lazy(() => import('src/components/dashboard/Overview'));
const Upload = React.lazy(() => import('src/components/dashboard/Upload'));
const Page404 = React.lazy(() => import('src/components/shared/Page404'));

// const TheLayout = React.lazy(() => import('src/components/containers/TheLayout'));
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

interface Dashboard {}

const Dashboard = ({}: Dashboard) => {
  const { user } = useSelector((state: RootState) => state.authentication);
  const { navigate } = useRouter();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  return (
    <div>
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <TheHeader />
        <div className="body flex-grow-1 px-3">
          <CContainer fluid className="px-0">
            <Suspense fallback={loading}>
              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="*" element={<Page404 />} />
              </Routes>
            </Suspense>
          </CContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
