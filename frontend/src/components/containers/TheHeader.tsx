import { cilAccountLogout } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton, CContainer, CHeader, CHeaderNav, CNavItem } from '@coreui/react-pro';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'src/utils/hooks';
import { RootState } from '../../reducers';
import { logout } from '../auth/auth.reducer';

const TheHeader = () => {
  const dispatch = useDispatch();
  const { location, navigate } = useRouter();
  const isDashboard = location.pathname === '/dashboard';

  const onLogout = () => {
    dispatch(logout());
  };

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer>
        <CHeaderNav>
          <CNavItem>
            {isDashboard ? (
              <CButton onClick={() => navigate('/dashboard/upload')} variant="outline">
                Upload
              </CButton>
            ) : (
              <CButton onClick={() => navigate('/dashboard')} variant="outline" color="info">
                Overview
              </CButton>
            )}
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav onClick={onLogout} className={`d-flex ms-auto`}>
          <CNavItem>
            <CIcon icon={cilAccountLogout} size="lg" />
          </CNavItem>
        </CHeaderNav>
      </CContainer>
    </CHeader>
  );
};

export default TheHeader;
