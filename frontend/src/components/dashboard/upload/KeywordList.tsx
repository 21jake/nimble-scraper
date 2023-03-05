import CsvImg from 'src/assets/img/csv-icon.png';

import CIcon from '@coreui/icons-react';
import { CButton, CCard, CCardBody, CCardHeader, CCardTitle, CCol, CImage, CRow } from '@coreui/react-pro';
import { truncate } from 'lodash';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

export default KeywordList;
