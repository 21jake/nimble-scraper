import { cilArrowThickToTop, cilCheck, cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CLink,
  CLoadingButton,
  CProgress,
  CProgressBar,
  CRow,
} from '@coreui/react-pro';
import dayjs from 'dayjs';
import { truncate } from 'lodash';
import React from 'react';
import { appEnv } from 'src/config/constants';
import { IKeyword } from 'src/models/keyword.model';
import { keywords } from './data';

interface IUploadProps {}

const Upload = ({}: IUploadProps) => {
  return (
    <CRow>
      <CCol xs={6} className={`border`}>
        <CForm>
          <CFormLabel htmlFor="csvfile">
            <small>Upload CSV file here</small>
          </CFormLabel>
          <CFormInput type="file" id="csvfile" name="file" />

          <CButton className={`mt-3`} variant="outline">
            Submit
          </CButton>
          <CProgress className="mt-3">
            <CProgressBar color="primary" variant="striped" animated value={25} />
          </CProgress>
        </CForm>

        <RecordDetails />
      </CCol>

      <CCol xs={6} className={`border`}>
        <KeywordDetails keyword={keywords[10]} />
      </CCol>
      <CCol xs={12} className={`border border-danger mt-3`}>
        <KeywordList />
      </CCol>
    </CRow>
  );
};

interface IKeywordDetailsProps {
  keyword: IKeyword;
}
// eyword
// 	Status
// 	Ads count
// 	Links count
// 	Total results
// 	Search time
// 	HTML

const KeywordDetails = (props: IKeywordDetailsProps) => {
  const { keyword } = props;

  const htmlHref = keyword.fileName ? `${appEnv.SERVER_URL}/${keyword.fileName}` : null;

  const keywordStatus = (success: null | boolean) => {
    if (success === null) {
      return 'Pending';
    }
    if (success) {
      return 'Success';
    } else {
      return 'Failed';
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <h6 className="my-3 lead">Keyword Details</h6>
      </CCol>
      <CCol xs={12}>
        <p>
          <span className={`fw-semibold`}>Name:</span> {keyword.name}
        </p>
      </CCol>
      <CCol xs={12}>
        <p>
          <span className={`fw-semibold`}>Cache:</span>{' '}
          {htmlHref ? (
            <CLink href={htmlHref} target="_blank">
              {keyword.fileName}
            </CLink>
          ) : (
            '_'
          )}
        </p>
      </CCol>
      <CCol xs={6}>
        <p>
          <span className={`fw-semibold`}>Status:</span> {keywordStatus(keyword.success)}
        </p>
      </CCol>
      <CCol xs={6}>
        <p>
          <span className={`fw-semibold`}>Total Ads:</span> {keyword.totalAds || '_'}
        </p>
      </CCol>
      <CCol xs={6}>
        <p>
          <span className={`fw-semibold`}>Total Links:</span> {keyword.totalLinks || '_'}
        </p>
      </CCol>
      <CCol xs={6}>
        <p>
          <span className={`fw-semibold`}>Total Results:</span>{' '}
          {keyword.totalResults ? Number(keyword.totalResults).toLocaleString('vi') : '_'}
        </p>
      </CCol>
      <CCol xs={6}>
        <p>
          <span className={`fw-semibold`}>Search Time:</span> {keyword.searchTime || '_'}
        </p>
      </CCol>
      <CCol xs={6}>
        <p>
          <span className={`fw-semibold`}>Cache:</span> {keyword.totalLinks || '_'}
        </p>
      </CCol>
    </CRow>
  );
};

const KeywordList = () => {
  const keywordColor = (success: null | boolean) => {
    if (success === null) {
      return 'warning';
    }
    if (success) {
      return 'success';
    } else {
      return 'danger';
    }
  };

  const keywordIcon = (success: null | boolean) => {
    if (success === null) {
      return cilArrowThickToTop;
    }
    if (success) {
      return cilCheck;
    } else {
      return cilX;
    }
  };

  return (
    <CRow className={`mt-3`}>
      {keywords.map((keyword, index) => {
        return (
          <CCol xs={2} key={index}>
            <CButton color={keywordColor(keyword.success)} variant="outline" className={`border-0`} size="sm">
              <CIcon icon={keywordIcon(keyword.success)} /> {truncate(`${keyword.name}`, { length: 13 })}
            </CButton>
          </CCol>
        );
      })}
    </CRow>
  );
};

const RecordDetails = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <h6 className="mt-3 lead">CSV Record details</h6>
      </CCol>
      <CCol xs={6}>
        <p>
          <span className={`fw-semibold`}>Processed keywords:</span> 30/123
        </p>
      </CCol>
      <CCol xs={6}>
        <p>
          <span className={`fw-semibold`}> Uploaded:</span> {`${dayjs().format(appEnv.APP_DATE_FORMAT)}`}
        </p>
      </CCol>
    </CRow>
  );
};

export default Upload;
