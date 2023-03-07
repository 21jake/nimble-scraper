import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CRow,
} from '@coreui/react-pro';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastError } from 'src/components/shared/Toast';
import { IKeyword } from 'src/models/keyword.model';
import { RootState } from 'src/reducers';
import { checkIfFileIsCsv } from 'src/utils/helpers';
import * as Yup from 'yup';
import { IUploadFile, uploadCsv } from '../dashboard.api';
import { fetching, partialReset } from '../dashboard.reducer';
import FormatGuide from './FormatGuide';
import KeywordDetails from './KeywordDetails';
import KeywordList from './KeywordList';
import RecordDetails from './RecordDetails';

dayjs.extend(duration);

const initialValues: IUploadFile = {
  file: undefined,
};

const validationSchema = Yup.object().shape({
  file: Yup.mixed().required('File is required').test('is-csv-file', 'Must upload a CSV file', checkIfFileIsCsv),
});

const Upload = () => {
  const dispatch = useDispatch();
  const { initialState } = useSelector((state: RootState) => state.dashboard);
  const { streaming, errorMessage } = initialState;

  const [chosenKeyword, setChosenKeyword] = useState<IKeyword | null>(null);

  const [guideVisible, setGuideVisible] = useState(false);
  const popupGuide = () => setGuideVisible(true);

  useEffect(() => {
    if (errorMessage) {
      ToastError(errorMessage);
      dispatch(partialReset());
    }
  }, [errorMessage]);

  return (
    <CRow>
      <FormatGuide visible={guideVisible} setVisible={setGuideVisible} />
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <CCardTitle className={`mb-0`}>Upload file</CCardTitle>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol xs={12} lg={6}>
                <Formik
                  enableReinitialize
                  initialValues={initialValues}
                  onSubmit={(values) => {
                    dispatch(fetching());
                    dispatch(uploadCsv(values));
                    // dispatch(signup(values));
                  }}
                  validationSchema={validationSchema}
                >
                  {({
                    isSubmitting,
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleSubmit,
                    setFieldValue,
                    handleChange,
                  }) => (
                    <CForm onSubmit={handleSubmit}>
                      <CFormInput
                        type="file"
                        id="csvfile"
                        name="file"
                        onChange={(e) => {
                          if (e.target.files) {
                            setFieldValue('file', e.target.files[0]);
                          }
                        }}
                      />

                      <CFormFeedback invalid className={!!errors.file && touched.file ? 'd-block' : 'd-none'}>
                        {errors.file}
                      </CFormFeedback>
                      <p className="text-medium-emphasis small mt-1">
                        Take a look at the{' '}
                        <span className="text-info cursor-pointer" onClick={popupGuide}>
                          CSV file format
                        </span>{' '}
                        to ensure everything works as expected.
                      </p>
                      <CButton variant="outline" type="submit" disabled={streaming}>
                        Upload
                      </CButton>
                    </CForm>
                  )}
                </Formik>
                <RecordDetails />
              </CCol>

              <CCol xs={12} lg={6}>
                <KeywordDetails keyword={chosenKeyword} />
              </CCol>
              <CCol xs={12}>
                <KeywordList setChosenKeyword={setChosenKeyword} />
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Upload;
