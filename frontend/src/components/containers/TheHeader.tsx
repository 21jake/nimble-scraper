import { cilAccountLogout, cilBell, cilEnvelopeOpen, cilList, cilMenu } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CBreadcrumb,
  CContainer,
  CHeader,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavItem,
  CNavLink,
} from '@coreui/react-pro';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reducers';
import { logout } from '../auth/auth.reducer';
import AppBreadcrumb from './AppBreadcrumb';
import { toggleSidebar } from './reducer';

const TheHeader = () => {
  const dispatch = useDispatch();
  const { sidebarShow } = useSelector((state: RootState) => state.container);

  const toggleSidebarDesktop = () => {
    dispatch(toggleSidebar(!sidebarShow));
  };

  const onLogout = () => {
    dispatch(logout());
  };

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderNav className="d-flex me-auto">
          <CHeaderToggler className="ps-1" onClick={toggleSidebarDesktop}>
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>
        </CHeaderNav>
        <CHeaderNav onClick={onLogout}>
          <CNavItem>
            <CIcon icon={cilAccountLogout} size="lg" />
          </CNavItem>
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  );
};

export default TheHeader;
