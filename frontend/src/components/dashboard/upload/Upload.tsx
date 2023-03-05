import CIcon from '@coreui/icons-react';
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
  CImage,
  CLink,
  CProgress,
  CProgressBar,
  CRow,
} from '@coreui/react-pro';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Formik } from 'formik';
import { truncate } from 'lodash';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CsvImg from 'src/assets/img/csv-icon.png';
import InfoLoader from 'src/components/shared/InfoLoader';
import { appEnv } from 'src/config/constants';
import { IKeyword } from 'src/models/keyword.model';
import { RootState } from 'src/reducers';
import { checkIfFileIsCsv, getKeywordStatus } from 'src/utils/helpers';
import { useStopWatch } from 'src/utils/hooks';
import * as Yup from 'yup';
import { IUploadFile, uploadCsv } from '../dashboard.api';
import { fetching, setKwProcessedCount, streaming } from '../dashboard.reducer';
import { statusBadge } from '../overview/KeywordsOverview';

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
  const { streaming } = initialState;

  const [chosenKeyword, setChosenKeyword] = useState<IKeyword | null>(null);

  return (
    <CRow>
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

                      <CButton className={`mt-3`} variant="outline" type="submit" disabled={streaming}>
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
              <CCol xs={12} >
                <KeywordList setChosenKeyword={setChosenKeyword} />
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

interface IKeywordDetailsProps {
  keyword: IKeyword | null;
}

const KeywordDetails = (props: IKeywordDetailsProps) => {
  const { keyword } = props;

  const htmlHref = keyword?.fileName ? `${appEnv.SERVER_URL}/${keyword.fileName}` : null;

  return (
    <CRow >
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <CCardTitle className={`mb-0`}>Keyword inpector</CCardTitle>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol xs={12}>
                <h6 className="mb-3 lead">{keyword ? 'Keyword details' : 'Click on any keyword to inspect'}</h6>
              </CCol>
              <CCol xs={12}>
                <p>
                  <span className={`fw-semibold`}>Name:</span> {keyword?.name || <InfoLoader width={200} />}
                </p>
              </CCol>
              <CCol xs={12}>
                <p>
                  <span className={`fw-semibold`}>Cache:</span>{' '}
                  {htmlHref ? (
                    <CLink href={htmlHref} target="_blank">
                      {keyword?.fileName}
                    </CLink>
                  ) : (
                    <InfoLoader width={200} />
                  )}
                </p>
              </CCol>
              <CCol xs={6}>
                <p>
                  <span className={`fw-semibold`}>Status:</span>{' '}
                  {keyword ? statusBadge(keyword.success) : <InfoLoader />}
                </p>
              </CCol>
              <CCol xs={6}>
                <p>
                  <span className={`fw-semibold`}>Total Ads:</span> {keyword?.totalAds || <InfoLoader />}
                </p>
              </CCol>
              <CCol xs={6}>
                <p>
                  <span className={`fw-semibold`}>Total Links:</span> {keyword?.totalLinks || <InfoLoader />}
                </p>
              </CCol>
              <CCol xs={6}>
                <p>
                  <span className={`fw-semibold`}>Total Results:</span>{' '}
                  {keyword?.totalResults ? Number(keyword.totalResults).toLocaleString('vi') : <InfoLoader />}
                </p>
              </CCol>
              <CCol xs={6}>
                <p>
                  <span className={`fw-semibold`}>Search Time:</span>{' '}
                  {keyword?.searchTime ? `${keyword?.searchTime} s` : <InfoLoader />}
                </p>
              </CCol>
              {keyword?.error ? (
                <CCol xs={12}>
                  <p>
                    <span className={`fw-semibold`}>Failure Reason:</span> {keyword?.error}
                  </p>
                </CCol>
              ) : (
                ''
              )}
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

interface IKeywordListProps {
  setChosenKeyword: Dispatch<SetStateAction<IKeyword | null>>;
}

const KeywordList = ({ setChosenKeyword }: IKeywordListProps) => {
  const dispatch = useDispatch();
  const { initialState } = useSelector((state: RootState) => state.dashboard);
  const { batch } = initialState;
  const [keywords, setKeywords] = useState<IKeyword[]>([]);

  useEffect(() => {
    if (batch) {
      dispatch(streaming(true));
      const eventSource = new EventSource(`${appEnv.SERVER_API_URL}/file/${batch.id}`);
      eventSource.onmessage = (e) => {
        const kws: IKeyword[] = JSON.parse(e.data);
        setKeywords(kws);

        const totalCompleted = kws.filter((kw) => kw.success !== null).length;
        dispatch(setKwProcessedCount(totalCompleted));

        if (totalCompleted === batch.keywordCount) {
          dispatch(streaming(false));
          eventSource.close();
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batch]);

  return (
    <CRow className={`mt-3`}>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <CCardTitle className={`mb-0`}>Keyword lists</CCardTitle>
          </CCardHeader>
          <CCardBody>
            <CRow>
              {keywords.length ? (
                keywords.map((keyword) => {
                  const { color, icon } = getKeywordStatus(keyword.success);
                  return (
                    <CCol xs={4} key={keyword.id}>
                      <CButton
                        color={color}
                        variant="outline"
                        className={`border-0`}
                        size="sm"
                        onClick={() => {
                          setChosenKeyword(keyword);
                          window.scrollTo(0, 0);
                        }}
                      >
                        <CIcon icon={icon} /> {truncate(`${keyword.name}`, { length: 13 })}
                      </CButton>
                    </CCol>
                  );
                })
              ) : (
                <CRow>
                  <CCol xs={12} className={`d-flex justify-content-center`}>
                    <CImage src={CsvImg} height={80} className={`constant-tilt-shake`} />
                  </CCol>
                  <CCol xs={12} className={`d-flex justify-content-center`}>
                    <small className={` mt-3`}>Start by uploading a CSV file</small>
                  </CCol>
                </CRow>
              )}
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

const RecordDetails = () => {
  const { initialState } = useSelector((state: RootState) => state.dashboard);

  const { start, stop, time } = useStopWatch();

  const { batch, streaming } = initialState;

  useEffect(() => {
    if (streaming) {
      start();
    } else {
      stop();
    }
  }, [streaming, start, stop]);

  if (!batch)
    return (
      <CProgress className="my-3">
        <CProgressBar color="primary" variant="striped" animated value={0} />
      </CProgress>
    );

  const progress = (Number(batch.processedCount) / Number(batch.keywordCount)) * 100;
  const uploadTime = dayjs.duration({ seconds: time / 1000 }).format('ss');
  return (
    <CRow className={`my-3`}>
      <CCol xs={12}>
        <CProgress className="mt-3">
          <CProgressBar color="primary" variant="striped" animated value={progress || 0} />
        </CProgress>
      </CCol>
      <CCol xs={12}>
        <h6 className="mt-3 lead">{`${batch.originalName}`}</h6>
      </CCol>
      <CCol xs={6}>
        <p>
          <span className={`fw-semibold`}>Processed:</span> {`${batch.processedCount} / ${batch.keywordCount}`}
        </p>
      </CCol>
      <CCol xs={6}>
        <p>
          <span className={`fw-semibold`}> Uploaded:</span>{' '}
          {`${dayjs(batch?.createdDate).format(appEnv.APP_DATE_FORMAT)}`}
        </p>
      </CCol>
      <CCol xs={6}>
        <p>
          <span className={`fw-semibold`}> Time:</span> {`${uploadTime} s`}
        </p>
      </CCol>
    </CRow>
  );
};

export default Upload;
