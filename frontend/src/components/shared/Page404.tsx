import { cilMagnifyingGlass } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton, CCol, CContainer, CFormInput, CImage, CInputGroup, CInputGroupText, CRow } from '@coreui/react-pro';
import notFoundImg from 'src/assets/img/404.png';
import { useRouter } from 'src/utils/hooks';

const Page404 = () => {
  const { navigate } = useRouter();
  return (
    <div className="min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5} className="my-auto">
            <div className="clearfix">
              <h1 className="float-start display-3 me-4">404</h1>
              <h4 className="pt-3">Oops! You{"'"}re lost.</h4>
              <p className="text-medium-emphasis float-start">The page you are looking for was not found.</p>
            </div>
            <p className="text-medium-emphasis mt-3 cursor-pointer" onClick={() => navigate(-2)}>
              <u className={`text-primary`}>Return to your previous location</u>
            </p>
          </CCol>
          <CCol md={7}>
            <CImage fluid src={notFoundImg} />
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Page404;
