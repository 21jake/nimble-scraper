import { cilAccountLogout } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CContainer,
  CHeader, CHeaderNav, CNavItem
} from '@coreui/react-pro';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reducers';
import { logout } from '../auth/auth.reducer';

const TheHeader = () => {
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(logout());
  };

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
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
