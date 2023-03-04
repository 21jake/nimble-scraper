import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CBadge,
  CNavGroup,
  CNavGroupItems,
  CNavItem,
  CNavTitle,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarToggler,
} from '@coreui/react-pro';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reducers';
import { toggleSidebar } from './reducer';

const TheSidebar = () => {
  const dispatch = useDispatch();
  const containerState = useSelector((state: RootState) => state.container);
  const { sidebarShow } = containerState;
  const [unfoldable, setUnfoldable] = useState<boolean>(false);

  return (
    <CSidebar
      position="fixed"
      visible={sidebarShow}
      unfoldable={unfoldable}
      onVisibleChange={(val: boolean) => dispatch(toggleSidebar(val))}
    >
      <CSidebarNav>
        <CNavTitle>Theme</CNavTitle>
        <CNavItem href="dashboard/theme/colors">
          <CIcon icon={cilDrop} customClassName="nav-icon" />
          Colors
        </CNavItem>
        <CNavItem href="dashboard/theme/typography">
          <CIcon icon={cilPencil} customClassName="nav-icon" />
          Typography
        </CNavItem>
      </CSidebarNav>
      <CSidebarToggler className="d-none d-lg-flex" onClick={() => setUnfoldable(!unfoldable)} />
    </CSidebar>
  );
};

export default React.memo(TheSidebar);
