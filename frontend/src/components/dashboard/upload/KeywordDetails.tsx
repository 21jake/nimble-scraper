import { CCard, CCardBody, CCardHeader, CCardTitle, CCol, CLink, CRow } from '@coreui/react-pro';
import InfoLoader from 'src/components/shared/InfoLoader';
import { appEnv } from 'src/config/constants';
import { IKeyword } from 'src/models/keyword.model';
import { statusBadge } from '../overview/KeywordsOverview';

interface IKeywordDetailsProps {
  keyword: IKeyword | null;
}

const KeywordDetails = (props: IKeywordDetailsProps) => {
  const { keyword } = props;

  const htmlHref = keyword?.fileName ? `${appEnv.SERVER_URL}/${keyword.fileName}` : null;

  return (
    <CRow>
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

export default KeywordDetails;
