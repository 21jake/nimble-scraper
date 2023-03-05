import { cilFilterX, cilReload, cilSearch } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CBadge,
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CLink,
  CMultiSelect,
  CRow,
  CSmartPagination,
  CSmartTable,
  CTooltip,
} from '@coreui/react-pro';
import { Formik } from 'formik';
import { truncate } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { appEnv } from 'src/config/constants';
import { IKeyword } from 'src/models/keyword.model';
import { RootState } from 'src/reducers';
import { createIndexes, getKeywordStatus, tableProps } from 'src/utils/helpers';
import { getKeywords, IParams } from '../dashboard.api';
import { dashboardSelectors, fetching } from '../dashboard.reducer';
// import { batches, keywords } from '../data';

import { ITabPaneProps } from './CsvOverview';

const columns = [
  {
    key: 'index',
    filter: false,
    sorter: false,
  },
  {
    key: 'keyword',
    label: 'Keyword',
    filter: false,
    sorter: false,
  },
  {
    key: 'status',
    label: 'Status',
    filter: false,
    sorter: false,
  },
  {
    key: 'totalAds',
    label: 'Ads count',
    filter: false,
    sorter: false,
  },
  {
    key: 'totalLinks',
    label: 'Links count',
    filter: false,
    sorter: false,
  },

  {
    key: 'totalResults',
    label: 'Total results',
    filter: false,
    sorter: false,
  },
  {
    key: 'searchTime',
    label: 'Search time (s)',
    filter: false,
    sorter: false,
  },
  {
    key: 'cacheFile',
    label: 'HTML Cache',
    filter: false,
    sorter: false,
  },
];
export const statusBadge = (success: null | boolean) => {
  const { text, color } = getKeywordStatus(success);
  return <CBadge color={color}>{text}</CBadge>;
};

const KeywordsOverview = (props: ITabPaneProps) => {
  const { activeKey, batchId } = props;
  const dispatch = useDispatch();

  const [filterState, setFilterState] = useState<IParams>({
    page: 0,
    size: 25,
  });

  const { initialState } = useSelector((state: RootState) => state.dashboard);
  const { totalItems, cacheBatches } = initialState;
  const totalPages = Math.ceil(totalItems / filterState.size);

  const handlePaginationChange = (page: number) => {
    if (page !== 0) {
      window.scrollTo(0, 0);
      setFilterState({ ...filterState, page: page - 1 });
    }
  };

  const keywords = useSelector(dashboardSelectors.selectAll);
  const indexedKeywords = createIndexes(keywords, filterState);

  const csvMultipleOption = cacheBatches.map((element) => ({
    value: element.id,
    text: element.originalName,
    selected: batchId ? batchId === element.id : false,
  }));

  useEffect(() => {
    setFilterState({ ...filterState, batchId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchId]);

  useEffect(() => {
    if (activeKey === 2) {
      dispatch(fetching());
      dispatch(getKeywords(filterState));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey, JSON.stringify(filterState)]);

  return (
    <CRow>
      <Formik
        enableReinitialize
        initialValues={filterState}
        onSubmit={(values) => setFilterState({ ...filterState, ...values })}
      >
        {({ values, handleSubmit, handleBlur, handleChange, setFieldValue, submitForm }) => (
          <CForm className="form-horizontal" onSubmit={handleSubmit}>
            <CRow className="my-2">
              <CCol xs={6} lg={3} className={`mt-2`}>
                <CInputGroup>
                  <CInputGroupText className="bg-white border-end-0">
                    <CIcon icon={cilSearch} />
                  </CInputGroupText>
                  <CFormInput
                    className="border-start-0"
                    placeholder="Enter keyword..."
                    id="keyword"
                    name="keyword"
                    value={values.keyword || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="none"
                  />
                </CInputGroup>
              </CCol>
              <CCol xs={6} lg={3} className={`mt-2`}>
                <CFormSelect id="status" name="status" onChange={handleChange} value={values.status}>
                  <option value="">Status</option>
                  <option value={'PENDING'}>PENDING</option>
                  <option value={'SUCCESS'}>SUCCESS</option>
                  <option value={'FAILED'}>FAILED</option>
                </CFormSelect>
              </CCol>
              <CCol xs={6} lg={3} className={`mt-2`}>
                <CMultiSelect
                  key={`CSV${JSON.stringify(csvMultipleOption)}`}
                  placeholder="Select CSV"
                  id="batchId"
                  options={[{ value: '', text: 'All' }, ...csvMultipleOption]}
                  onChange={(selected) => {
                    const [chosenBatch] = selected;
                    if (chosenBatch) {
                      setFieldValue('batchId', chosenBatch.value);
                    }
                  }}
                  optionsMaxHeight={400}
                  multiple={false}
                  optionsStyle="text"
                />
              </CCol>
              <CCol xs={6} lg={3} className="d-flex justify-content-end mt-2">
                <CTooltip content="Clear filter">
                  <CButton
                    color="secondary"
                    variant="outline"
                    className={` me-3 border-0`}
                    onClick={() => {
                      setFieldValue('keyword', '');
                      setFieldValue('batchId', '');
                      setFieldValue('status', '');
                      submitForm();
                    }}
                  >
                    <CIcon icon={cilFilterX} />
                  </CButton>
                </CTooltip>
                <CTooltip content="Reload table">
                  <CButton
                    color="info"
                    variant="outline"
                    className={` me-3 border-0`}
                    onClick={() => {
                      submitForm();
                    }}
                  >
                    <CIcon icon={cilReload} />
                  </CButton>
                </CTooltip>
                <CButton type="submit">Search</CButton>
              </CCol>
            </CRow>
          </CForm>
        )}
      </Formik>
      <h5 className={`mt-1 mb-3`}>
        Total items: <span className="text-info">{totalItems}</span>
      </h5>
      <CSmartTable
        clickableRows
        columns={columns}
        items={indexedKeywords}
        itemsPerPage={filterState.size}
        noItemsLabel="No keywords found"
        scopedColumns={{
          keyword: (item: IKeyword) => <td>{truncate(item.name, { length: 25 })}</td>,
          status: (item: IKeyword) => <td>{statusBadge(item.success)}</td>,
          totalLinks: (item: IKeyword) => <td>{item.totalLinks || ''}</td>,
          totalAds: (item: IKeyword) => <td>{item.totalAds || ''}</td>,
          totalResults: (item: IKeyword) => (
            <td>{item.totalResults ? Number(item.totalResults).toLocaleString('vi') : ''}</td>
          ),
          searchTime: (item: IKeyword) => <td>{item.searchTime || ''}</td>,
          cacheFile: (item: IKeyword) => {
            if (!item.fileName) return <td></td>;
            const href = `${appEnv.SERVER_URL}/${item.fileName}`;
            return (
              <td>
                <CLink href={href} target="_blank">
                  {truncate(item.fileName, { length: 20 })}
                </CLink>
              </td>
            );
          },
        }}
        tableProps={tableProps}
      />
      <CSmartPagination
        align="start"
        activePage={filterState.page + 1}
        pages={totalPages}
        onActivePageChange={handlePaginationChange}
      />
    </CRow>
  );
};

export default KeywordsOverview;
