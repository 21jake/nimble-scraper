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
      <CSidebarBrand>Sidebar Brand</CSidebarBrand>
      <CSidebarNav>
        <CNavTitle>Nav Title</CNavTitle>
        <CNavItem href="#/table">
          <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
          Table
        </CNavItem>
        <CNavItem href="#/dashboard">
          <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
          Dashboard
          <CBadge color="info ms-auto">NEW</CBadge>
        </CNavItem>
        <CNavTitle>Theme</CNavTitle>
        <CNavItem href="#/theme/colors">
          <CIcon icon={cilDrop} customClassName="nav-icon" />
          Colors
        </CNavItem>
        <CNavItem href="#/theme/typography">
          <CIcon icon={cilPencil} customClassName="nav-icon" />
          Typography
        </CNavItem>
        <CNavTitle>Components</CNavTitle>
        <CNavGroup
          toggler={
            <>
              <CIcon icon={cilPuzzle} customClassName="nav-icon" /> Base
            </>
          }
        >
          <CNavGroupItems>
            <CNavItem href="#/base/accordion">Accordion</CNavItem>
            <CNavItem href="#/base/breadcrumbs">Breadcrumb</CNavItem>
            <CNavItem href="#/base/cards">Cards</CNavItem>
            <CNavItem href="#/base/carousels">Carousel</CNavItem>
            <CNavItem href="#/base/collapses">Collapse</CNavItem>
            <CNavItem href="#/base/jumbotrons">Jumbotron</CNavItem>
            <CNavItem href="#/base/list-groups">List group</CNavItem>
            <CNavItem href="#/base/breadcrumbs">{`Navs & Tabs`}</CNavItem>
            <CNavItem href="#/base/paginations">Pagination</CNavItem>
            <CNavItem href="#/base/placeholders">Placeholders</CNavItem>
            <CNavItem href="#/base/popovers">Popovers</CNavItem>
            <CNavItem href="#/base/progress">Progress</CNavItem>
            <CNavItem href="#/base/spinners">Spinners</CNavItem>
            <CNavItem href="#/base/tables">Tables</CNavItem>
            <CNavItem href="#/base/tooltips">Tooltips</CNavItem>
          </CNavGroupItems>
        </CNavGroup>
        <CNavGroup
          toggler={
            <>
              <CIcon icon={cilCursor} customClassName="nav-icon" /> Buttons
            </>
          }
        >
          <CNavGroupItems>
            <CNavItem href="#/buttons/buttons">Buttons</CNavItem>
            <CNavItem href="#/buttons/button-groups">Buttons groups</CNavItem>
            <CNavItem href="#/buttons/dropdowns">Dropdowns</CNavItem>
          </CNavGroupItems>
        </CNavGroup>
        <CNavGroup
          toggler={
            <>
              <CIcon icon={cilNotes} customClassName="nav-icon" /> Forms
            </>
          }
        >
          <CNavGroupItems>
            <CNavItem href="#/forms/form-control">Form Control</CNavItem>
            <CNavItem href="#/forms/select">Select</CNavItem>
            <CNavItem href="#/forms/checks-radios">{'Checks & Radios'}</CNavItem>
            <CNavItem href="#/forms/range">Range</CNavItem>
            <CNavItem href="#/forms/input-group">Input Group</CNavItem>
            <CNavItem href="#/forms/floating-labels">Floating Labels</CNavItem>
            <CNavItem href="#/forms/layout">Layout</CNavItem>
            <CNavItem href="#/forms/validation">Validation</CNavItem>
          </CNavGroupItems>
        </CNavGroup>
        <CNavItem href="#/charts">
          <CIcon icon={cilChartPie} customClassName="nav-icon" />
          Charts
        </CNavItem>
        <CNavGroup
          toggler={
            <>
              <CIcon icon={cilStar} customClassName="nav-icon" /> Icons
            </>
          }
        >
          <CNavGroupItems>
            <CNavItem href="#/icons/coreui-icons">
              CoreUI Free <CBadge color="success ms-auto">NEW</CBadge>
            </CNavItem>
            <CNavItem href="#/icons/flags">CoreUI Flags</CNavItem>
            <CNavItem href="#/icons/brands">CoreUI Brands</CNavItem>
          </CNavGroupItems>
        </CNavGroup>
        <CNavGroup
          toggler={
            <>
              <CIcon icon={cilBell} customClassName="nav-icon" /> Notifications
            </>
          }
        >
          <CNavGroupItems>
            <CNavItem href="#/notifications/alerts">Alerts</CNavItem>
            <CNavItem href="#/notifications/badges">Badges</CNavItem>
            <CNavItem href="#/notifications/modals">Modal</CNavItem>
            <CNavItem href="#/notifications/toasts">Toasts</CNavItem>
          </CNavGroupItems>
        </CNavGroup>
        <CNavItem href="#/widgets">
          <CIcon customClassName="nav-icon" icon={cilCalculator} />
          Widgets
          <CBadge color="info ms-auto">NEW</CBadge>
        </CNavItem>
        <CNavTitle>Extras</CNavTitle>
        <CNavGroup
          toggler={
            <>
              <CIcon icon={cilStar} customClassName="nav-icon" /> Pages
            </>
          }
        >
          <CNavGroupItems>
            <CNavItem href="#/login">Login</CNavItem>
            <CNavItem href="#/register">Register</CNavItem>
            <CNavItem href="#/404">Error 404</CNavItem>
            <CNavItem href="#/500">Error 500</CNavItem>
          </CNavGroupItems>
        </CNavGroup>
      </CSidebarNav>
      <CSidebarToggler className="d-none d-lg-flex" onClick={() => setUnfoldable(!unfoldable)} />
    </CSidebar>
  );
};

export default React.memo(TheSidebar);
