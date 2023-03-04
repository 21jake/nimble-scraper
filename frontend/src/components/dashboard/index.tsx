import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/reducers';
import { useRouter } from 'src/utils/hooks';

const TheLayout = React.lazy(() => import('src/components/containers/TheLayout'));

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
    <>
      <TheLayout />
    </>
  );
};

export default Dashboard;
