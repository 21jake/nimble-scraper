import { cilBell, cilEnvelopeOpen, cilList, cilMenu } from '@coreui/icons';
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
import AppBreadcrumb from './AppBreadcrumb';
import { toggleSidebar } from './reducer';

const TheHeader = () => {
  const dispatch = useDispatch();
  const { sidebarShow } = useSelector((state: RootState) => state.container);

  const toggleSidebarDesktop = () => {
    dispatch(toggleSidebar(!sidebarShow));
  };

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        {/* <CHeaderBrand className="mx-auto d-md-none" >
      </CHeaderBrand> */}
        <CHeaderNav className="d-flex me-auto">
          <CHeaderToggler className="ps-1" onClick={toggleSidebarDesktop}>
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>
        <CNavItem>
            <CNavLink href="#">Home</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Users</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Settings</CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilBell} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilList} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
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
