import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCollapse,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CForm,
  CFormInput,
  CImage,
  CNavbar,
  CNavbarNav,
  CNavbarBrand,
  CNavbarText,
  CNavbarToggler,
  CNavLink,
  CDropdown,
  CButton,
} from '@coreui/react-pro'
import DocsLink from '../../../containers/DocsLink'

const CNavbars = () => {
  const [visible, setVisible] = useState(false)
  const [isOpenDropdown, setIsOpenDropdown] = useState(false)
  const [navbarText, setNavbarText] = useState(false)

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          CNavbar
          <DocsLink name="CNavbar" />
        </CCardHeader>
        <CCardBody>
          <CNavbar expand="sm" color="info">
            <CNavbarToggler onClick={() => setVisible(!visible)} />
            <CNavbarBrand>NavbarBrand</CNavbarBrand>
            <CCollapse visible={visible} >
              <CNavbarNav>
                <CNavLink>Home</CNavLink>
                <CNavLink>Link</CNavLink>
              </CNavbarNav>
              <CNavbarNav className="ms-auto">
                <CForm className="d-flex">
                  <CFormInput className="me-sm-2" placeholder="Search" size="sm" />
                  <CButton color="light" className="my-2 my-sm-0" type="submit">
                    Search
                  </CButton>
                </CForm>
                <CDropdown >
                  <CDropdownToggle color="primary">Lang</CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem>EN</CDropdownItem>
                    <CDropdownItem>ES</CDropdownItem>
                    <CDropdownItem>RU</CDropdownItem>
                    <CDropdownItem>FA</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
                <CDropdown >
                  <CDropdownToggle color="primary">User</CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem>Account</CDropdownItem>
                    <CDropdownItem>Settings</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </CNavbarNav>
            </CCollapse>
          </CNavbar>
        </CCardBody>
      </CCard>

      <CCard className="mb-4">
        <CCardHeader>CNavbar brand</CCardHeader>
        <CCardBody>
          <CNavbar color="faded">
            <CNavbarBrand>
              <CImage
                src="https://placekitten.com/g/30/30"
                className="d-inline-block align-top"
                alt="CoreuiVue"
              />
              CoreUI React
            </CNavbarBrand>
          </CNavbar>
        </CCardBody>
      </CCard>

      <CCard className="mb-4">
        <CCardHeader>CNavbar text</CCardHeader>
        <CCardBody>
          <CNavbar expand="sm" color="light">
            <CNavbarToggler

              onClick={() => {
                setNavbarText(!navbarText)
              }}
            />
            <CNavbarBrand>NavbarBrand</CNavbarBrand>
            <CCollapse visible={navbarText}>
              <CNavbarNav>
                <CNavbarText>Navbar text</CNavbarText>
              </CNavbarNav>
            </CCollapse>
          </CNavbar>
        </CCardBody>
      </CCard>

      <CCard className="mb-4">
        <CCardHeader>CNavbar dropdown</CCardHeader>
        <CCardBody>
          <CNavbar expand={false} color="primary">
            <CNavbarToggler
              onClick={() => {
                setIsOpenDropdown(!isOpenDropdown)
              }}
            />
            <CCollapse visible={isOpenDropdown}>
              <CNavbarNav>
                <CNavLink>Home</CNavLink>
                <CNavLink>Link</CNavLink>
                <CDropdown>
                  <CDropdownToggle color="primary">Lang</CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem>EN</CDropdownItem>
                    <CDropdownItem>ES</CDropdownItem>
                    <CDropdownItem>RU</CDropdownItem>
                    <CDropdownItem>FA</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
                <CDropdown>
                  <CDropdownToggle color="primary">User</CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem>Account</CDropdownItem>
                    <CDropdownItem>Settings</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </CNavbarNav>
            </CCollapse>
          </CNavbar>
        </CCardBody>
      </CCard>

      <CCard className="mb-4">
        <CCardHeader>CNavbar form</CCardHeader>
        <CCardBody>
          <CNavbar color="light">
            <CForm className="d-flex">
              <CFormInput className="me-sm-2" placeholder="Search" size="sm" />
              <CButton color="outline-success" className="my-2 my-sm-0" type="submit">
                Search
              </CButton>
            </CForm>
          </CNavbar>
        </CCardBody>
      </CCard>

      <CCard className="mb-4">
        <CCardHeader>CNavbar input group</CCardHeader>
        <CCardBody>
          <CNavbar color="light">
            <CForm className="d-flex">
              <CFormInput className="me-sm-2" placeholder="Username" />
            </CForm>
          </CNavbar>
        </CCardBody>
      </CCard>
    </>
  )
}

export default CNavbars
