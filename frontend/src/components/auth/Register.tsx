import { cilLockLocked, cilUser } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormFeedback,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react-pro';
import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastError, ToastSuccess } from 'src/components/shared/Toast';
import { RootState } from 'src/reducers';
import { useRouter } from 'src/utils/hooks';
import * as Yup from 'yup';
import { ISignup, signup } from './auth.api';
import { fetching, partialReset, resetAll } from './auth.reducer';

const initialValues: ISignup = {
  username: '',
  password: '',
  confirmPassword: '',
};
const validationSchema = Yup.object().shape({
  username: Yup.string()
    .trim()
    .required('Please enter the username')
    .matches(/^[a-z0-9]+$/i, 'The username can only contain letters and numbers')
    .min(5, 'The username must be at least 5 characters')
    .max(15, 'The username must be at most 15 characters'),

  password: Yup.string()
    .trim()
    .required('Please enter the password')
    .min(5, 'The password must be at least 5 characters'),

  confirmPassword: Yup.string()
    .trim()
    .required('Please re-enter the password')
    .test('passwords-match', 'Inconsistent passwords', function (value) {
      return this.parent.password === value;
    }),
});

const Register = () => {
  const { navigate } = useRouter();
  const dispatch = useDispatch();
  const { errorMessage, signupSuccess, user } = useSelector((state: RootState) => state.authentication);

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

  useEffect(() => {
    if (signupSuccess) {
      ToastSuccess('Successfully registered!');
      dispatch(partialReset());
      navigate('/dashboard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signupSuccess]);

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <Formik
                  enableReinitialize
                  validationSchema={validationSchema}
                  initialValues={initialValues}
                  onSubmit={(values) => {
                    dispatch(fetching());
                    dispatch(signup(values));
                  }}
                >
                  {({
                    isSubmitting,
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleSubmit,
                    setFieldValue,
                  }) => (
                    <CForm onSubmit={handleSubmit}>
                      <h1>Register</h1>
                      <p className="text-medium-emphasis">One click away from the magic</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          value={values.username}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setFieldValue('username', e.target.value.trim());
                          }}
                          onBlur={handleBlur}
                          id="login"
                          name="username"
                          placeholder="Username"
                          autoComplete="username"
                        />
                        <CFormFeedback invalid className={!!errors.username && touched.username ? 'd-block' : 'd-none'}>
                          {errors.username}
                        </CFormFeedback>
                      </CInputGroup>

                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>

                        <CFormInput
                          value={values.password}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setFieldValue('password', e.target.value.trim());
                          }}
                          onBlur={handleBlur}
                          type="password"
                          id="password"
                          name="password"
                          autoComplete="none"
                          placeholder="Password"
                        />
                        <CFormFeedback invalid className={!!errors.password && touched.password ? 'd-block' : 'd-none'}>
                          {errors.password}
                        </CFormFeedback>
                      </CInputGroup>

                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          value={values.confirmPassword}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setFieldValue('confirmPassword', e.target.value.trim());
                          }}
                          onBlur={handleBlur}
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          autoComplete="none"
                          placeholder="Repeat password"
                        />
                        <CFormFeedback
                          invalid
                          className={!!errors.confirmPassword && touched.confirmPassword ? 'd-block' : 'd-none'}
                        >
                          {errors.confirmPassword}
                        </CFormFeedback>
                      </CInputGroup>

                      <div className="d-grid">
                        <CButton color="success" type="submit" disabled={isSubmitting}>
                          Create Account
                        </CButton>
                      </div>
                    </CForm>
                  )}
                </Formik>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Register;
