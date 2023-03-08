import { cilExternalLink, cilFilterX, cilReload, cilSearch } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSmartPagination,
  CSmartTable,
  CTooltip,
} from '@coreui/react-pro';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { appEnv } from 'src/config/constants';
import { IBatch } from 'src/models/batch.model';
import { RootState } from 'src/reducers';
import { createIndexes, tableProps } from 'src/utils/helpers';
import { getBatches, IParams } from '../dashboard.api';
import { dashboardSelectors, fetching } from '../dashboard.reducer';

const columns = [
  {
    key: 'index',
    filter: false,
    sorter: false,
  },
  {
    key: 'originalName',
    label: 'Original Name',
    filter: false,
    sorter: false,
  },
  {
    key: 'totalKeyword',
    label: 'Processed / Total Words',
    filter: false,
    sorter: false,
  },
  {
    key: 'createdDate',
    label: 'Uploaded at',
    filter: false,
    sorter: false,
  },
  {
    key: 'action',
    label: 'Details',
    filter: false,
    sorter: false,
    _props: { className: 'text-center' },
  },
];

export interface ITabPaneProps {
  activeKey: number;
  setActiveKey: React.Dispatch<React.SetStateAction<number>>;
  batchId?: number;
  setBatchId?: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const CsvOverview = (props: ITabPaneProps) => {
  const { activeKey, setActiveKey, setBatchId } = props;
  const dispatch = useDispatch();
  const { initialState } = useSelector((state: RootState) => state.dashboard);
  const { totalItems, loading } = initialState;

  const [filterState, setFilterState] = useState<IParams>({
    page: 0,
    size: 25,
    timestamp: dayjs().unix()
  });

  const batches = useSelector(dashboardSelectors.selectAll);
  const indexedBatches = createIndexes(batches, filterState);
  const totalPages = Math.ceil(totalItems / filterState.size);

  const handlePaginationChange = (page: number) => {
    if (page !== 0) {
      window.scrollTo(0, 0);
      setFilterState({ ...filterState, page: page - 1 });
    }
  };

  useEffect(() => {
    if (activeKey === 1) {
      dispatch(fetching());
      dispatch(getBatches(filterState));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filterState), activeKey]);

  return (
    <CRow>
      <Formik
        enableReinitialize
        initialValues={filterState}
        onSubmit={(values) => {
          setFilterState({ ...filterState, ...values, page: 0 });
        }}
      >
        {({ values, handleSubmit, handleBlur, handleChange, setFieldValue, submitForm }) => (
          <CForm className="form-horizontal row align-items-center " onSubmit={handleSubmit}>
            <CCol xs={6} md={4} >
              <CInputGroup className="my-2">
                <CInputGroupText className="bg-white border-end-0">
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  className="border-start-0"
                  placeholder="Enter keyword..."
                  id="keyword"
                  name="keyword"
                  value={values.keyword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="none"
                />
              </CInputGroup>
            </CCol>
            <CCol  className="d-flex justify-content-end ">
              <CTooltip content="Clear filter">
                <CButton
                  color="secondary"
                  variant="outline"
                  className={` me-3 border-0`}
                  onClick={() => {
                    setFieldValue('keyword', '');
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
                    setFieldValue('timestamp', dayjs().unix());
                    submitForm();
                  }}
                >
                  <CIcon icon={cilReload} />
                </CButton>
              </CTooltip>
              <CButton type="submit">Search</CButton>
            </CCol>
          </CForm>
        )}
      </Formik>
      <h5 className={`mt-1 mb-3`}>
        Total items: <span className="text-info">{totalItems}</span>
      </h5>
      <CSmartTable
        clickableRows
        columns={columns}
        items={indexedBatches}
        itemsPerPage={filterState.size}
        loading={loading}
        noItemsLabel="No CSV records found"
        scopedColumns={{
          originalName: (item: IBatch) => <td>{item.originalName}</td>,
          totalKeyword: (item: IBatch, i: number) => (
            <td>{item.keywordCount && item.processedCount ? `${item.processedCount} / ${item.keywordCount}` : '_'}</td>
          ),
          createdDate: (item: IBatch) => (
            <td>{`${dayjs(item.createdDate).format(appEnv.APP_DATE_FORMAT)} (${dayjs().diff(
              dayjs(item.createdDate),
              'hours',
            )} hours ago)`}</td>
          ),
          action: (item: IBatch) => {
            return (
              <td className={`text-center`}>
                <CTooltip content="View keywords">
                  <CButton
                    size="sm"
                    color="info"
                    variant="ghost"
                    onClick={() => {
                      setActiveKey(2);
                      setBatchId && setBatchId(item.id);
                    }}
                  >
                    <CIcon icon={cilExternalLink} />
                  </CButton>
                </CTooltip>
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

export default CsvOverview;
