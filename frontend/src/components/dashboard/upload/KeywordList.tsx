import CIcon from '@coreui/icons-react';
import { CButton, CCard, CCardBody, CCardHeader, CCardTitle, CCol, CImage, CRow } from '@coreui/react-pro';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { truncate } from 'lodash';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CsvImg from 'src/assets/img/csv-icon.png';
import { ToastInfo } from 'src/components/shared/Toast';
import { appEnv } from 'src/config/constants';
import { IKeyword } from 'src/models/keyword.model';
import { RootState } from 'src/reducers';
import { getKeywordStatus } from 'src/utils/helpers';
import { setKwProcessedCount, streaming } from '../dashboard.reducer';

interface IKeywordListProps {
  setChosenKeyword: Dispatch<SetStateAction<IKeyword | null>>;
}

const KeywordList = ({ setChosenKeyword }: IKeywordListProps) => {
  const dispatch = useDispatch();
  const { initialState } = useSelector((state: RootState) => state.dashboard);
  const { batch } = initialState;
  const [keywords, setKeywords] = useState<IKeyword[]>([]);
  const mountedRef = useRef(true);
  const keywordsRef = useRef<IKeyword[]>([]);

  const [serverError, setServerError] = useState<boolean>(false);

  useEffect(() => {
    if (serverError) {
      ToastInfo('There was an error from the Server. Please try upload again later');
    }
  }, [serverError]);

  // useEffect(() => {
  //   keywordsRef.current = [...keywordsRef.current, ...keywords];
  //   console.log({keywordsRefCurrent: keywordsRef.current})
  // }, [keywords]);

  const checkToStopStreaming = (kws: IKeyword[], ctrlr: AbortController) => {
    const totalCompleted = kws.filter((kw) => kw.success !== null).length;
    dispatch(setKwProcessedCount(totalCompleted));
    if (totalCompleted === batch?.keywordCount) {
      dispatch(streaming(false));
      ctrlr.abort();
    }
  };

  useEffect(() => {
    if (!batch) return;
    dispatch(streaming(true));
    const controller = new AbortController();
    const token = localStorage.getItem(appEnv.TOKEN_LABEL);
    const fetchData = async () => {
      await fetchEventSource(`${appEnv.SERVER_API_URL}/file/${batch.id}`, {
        headers: {
          // add bearer token
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
        async onopen(res) {
          console.log('Connection Established', res);
        },
        onmessage(event) {
          if (!mountedRef.current || !event.data) return null;
          const newBuffer: IKeyword[] = JSON.parse(event.data);

          // const mergedKeywords = [...keywordsRef.current, ...newBuffer];
          // console.log({keywords, newBuffer, mergedKeywords})

          // setKeywords((prevstate) => [...mergedKeywords]);
          keywordsRef.current = [...keywordsRef.current, ...newBuffer];

          setKeywords(keywordsRef.current);

          checkToStopStreaming(keywordsRef.current, controller);
        },
        onclose() {
          ToastInfo('Connection closed by the Server');
        },
        onerror(err) {
          setServerError(true);
          controller.abort();
        },
      });
    };
    fetchData();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batch]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

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

export default KeywordList;
