import { cilLockLocked, cilUser } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormFeedback,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow
} from '@coreui/react-pro';
import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from 'src/reducers';
import { useRouter } from 'src/utils/hooks';
import * as Yup from 'yup';
import { ToastError } from '../shared/Toast';
import { ILogin, login } from './auth.api';
import { fetching, resetAll } from './auth.reducer';

const validationSchema = Yup.object().shape({
  username: Yup.string().trim().required('Please enter your username'),
  password: Yup.string().trim().required('Please enter your password'),
});

const initialValues: ILogin = {
  username: '',
  password: '',
};

const Login = () => {
  const { navigate } = useRouter();
  const dispatch = useDispatch();

  const { errorMessage, user } = useSelector((state: RootState) => state.authentication);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (errorMessage) {
      ToastError(errorMessage);
      dispatch(resetAll());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMessage]);

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <Formik
                    enableReinitialize
                    validationSchema={validationSchema}
                    initialValues={initialValues}
                    onSubmit={(values) => {
                      dispatch(fetching());
                      dispatch(login(values));
                    }}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      setFieldValue,
                      isSubmitting,
                    }) => (
                      <CForm onSubmit={handleSubmit}>
                        <h1>Login</h1>
                        <p className="text-medium-emphasis">Sign In to your account</p>
                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormInput
                            placeholder="Username"
                            autoComplete="username"
                            value={values.username}
                            onChange={(e: React.FormEvent<HTMLInputElement>) => {
                              setFieldValue('username', e.currentTarget.value.trim().toLowerCase());
                            }}
                            type="text"
                            id="username"
                            name="username"
                            onBlur={handleBlur}
                          />
                          <CFormFeedback
                            invalid
                            className={!!errors.username && touched.username ? 'd-block' : 'd-none'}
                          >
                            {errors.username}
                          </CFormFeedback>
                        </CInputGroup>
                        <CInputGroup className="mb-4">
                          <CInputGroupText>
                            <CIcon icon={cilLockLocked} />
                          </CInputGroupText>
                          <CFormInput
                            value={values.password}
                            onChange={handleChange}
                            type="password"
                            id="password"
                            name="password"
                            autoComplete="none"
                            placeholder="Password"
                            onBlur={handleBlur}
                          />
                          <CFormFeedback
                            invalid
                            className={!!errors.password && touched.password ? 'd-block' : 'd-none'}
                          >
                            {errors.password}
                          </CFormFeedback>
                        </CInputGroup>
                        <CRow>
                          <CCol xs={6}>
                            <CButton color="primary" className="px-4" type="submit" disabled={isSubmitting}>
                              Login
                            </CButton>
                          </CCol>
                        </CRow>
                      </CForm>
                    )}
                  </Formik>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5">
                <CCardBody className="text-center">
                  <div >
                    <h2 className={`mb-3`}>Sign up</h2>
                    <p className={`mb-1`}>In the Land of Google where the data lies</p>
                    <p className={`mb-1`}>One scraper to rule them all</p>
                    <p className={`mb-1`}>One scraper to find them</p>
                    <p className={`mb-1`}>One scraper to cache them all</p>
                    <p className={`mb-1`}>...and in the dashboard you find them</p>
                    
                  </div>
                  <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Scrape it!
                      </CButton>
                    </Link>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
