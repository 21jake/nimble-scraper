import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  CRow,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/reducers';
import { useRouter } from 'src/utils/hooks';
import * as Yup from 'yup';
import { ILogin, login } from './auth.api';
import { ToastError } from '../shared/Toast';
import { fetching, resetAll } from './auth.reducer';
import { Formik } from 'formik';

const validationSchema = Yup.object().shape({
  username: Yup.string().trim().required('Please enter your username'),
  password: Yup.string().trim().required('Please enter your password'),
});

const initialValues: ILogin = {
  username: '',
  password: '',
};

const Login = () => {
  const { navigate, location, redirectView } = useRouter();
  const dispatch = useDispatch();

  const { errorMessage, user, loading } = useSelector((state: RootState) => state.authentication);

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
          <CCol md={8}>
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
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => (
                      <CForm  onSubmit={handleSubmit}>
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
                            placeholder="Mật khẩu"
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
                            <CButton color="primary" className="px-4" type='submit' disabled={isSubmitting}>
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
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
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
