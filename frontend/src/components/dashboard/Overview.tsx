import { cilExternalLink } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CBadge,
  CButton,
  CCol,
  CLink,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CSmartTable,
  CTabContent,
  CTabPane,
  CTooltip,
} from '@coreui/react-pro';
import dayjs from 'dayjs';
import { useState } from 'react';
import { appEnv } from 'src/config/constants';
import { IBatch } from 'src/models/batch.model';
import { IKeyword } from 'src/models/keyword.model';
import { batches, keywords } from './data';

interface IOverviewProps {}

console.log({ batches });

const Overview = ({}: IOverviewProps) => {
  const [activeKey, setActiveKey] = useState<number>(1);

  return (
    <>
      <CNav variant="tabs" className={`border`}>
        <CNavItem className="w-50 text-center cursor-pointer">
          <CNavLink
            active={activeKey === 1}
            onClick={() => {
              setActiveKey(1);
            }}
          >
            Uploaded CSVs
          </CNavLink>
        </CNavItem>
        <CNavItem className="w-50 text-center cursor-pointer">
          <CNavLink
            active={activeKey === 2}
            onClick={() => {
              setActiveKey(2);
            }}
          >
            Keywords Overview
          </CNavLink>
        </CNavItem>
      </CNav>
      <CTabContent>
        <CTabPane visible={activeKey === 1}>
          <UploadedCsv />
        </CTabPane>
        <CTabPane visible={activeKey === 2}>
          <KeywordsOverview />
        </CTabPane>
      </CTabContent>
    </>
  );
};

const UploadedCsv = () => {
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
      label: 'Keywords',
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
  return (
    <CSmartTable
      // activePage={3}
      clickableRows
      columns={columns}
      items={batches}
      // itemsPerPage={10}
      // columnSorter
      // cleaner
      noItemsLabel="No file uploaded yet"
      // itemsPerPageSelect
      scopedColumns={{
        originalName: (item: IBatch) => <td>{item.originalName}</td>,
        index: (item: IBatch, i: number) => <td>{i + 1}</td>,
        totalKeyword: (item: IBatch, i: number) => <td>{`5/10`}</td>,
        createdDate: (item: IBatch) => <td>{dayjs(item.createdDate).format(appEnv.APP_DATE_FORMAT)}</td>,
        action: () => {
          return (
            <td className={`text-center`}>
              <CTooltip content="View keywords">
                <CButton size="sm" color="info" variant="ghost">
                  <CIcon icon={cilExternalLink} />
                </CButton>
              </CTooltip>
            </td>
          );
        },
      }}
      tableProps={{
        striped: true,
        hover: true,
        align: 'middle',
        responsive: 'xl',
        bordered: true,
      }}
    />
  );
};

const KeywordsOverview = () => {
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
      label: 'Search time',
      filter: false,
      sorter: false,
    },
    {
      key: 'cacheFile',
      label: 'HTML',
      filter: false,
      sorter: false,
    },
  ];

  const keywordStatus = (success: null | boolean) => {
    if (success === null) {
      return <CBadge color={'warning'}>{'Pending'}</CBadge>;
    }
    if (success) {
      return <CBadge color={'success'}>{'Success'}</CBadge>;
    } else {
      return <CBadge color={'danger'}>{'Failed'}</CBadge>;
    }
  };

  return (
    <CSmartTable
      // activePage={3}
      clickableRows
      columns={columns}
      items={keywords}
      // itemsPerPage={10}
      // columnSorter
      // cleaner
      noItemsLabel="No records found"
      // itemsPerPageSelect
      scopedColumns={{
        index: (item: IKeyword, i: number) => <td>{i + 1}</td>,
        keyword: (item: IKeyword) => <td>{item.name}</td>,
        status: (item: IKeyword) => <td>{keywordStatus(item.success)}</td>,
        totalLinks: (item: IKeyword) => <td>{item.totalLinks || ''}</td>,
        totalAds: (item: IKeyword) => <td>{item.totalAds || ''}</td>,
        totalResults: (item: IKeyword) => (
          <td>{item.totalResults ? Number(item.totalResults).toLocaleString('vi') : ''}</td>
        ),
        searchTime: (item: IKeyword) => <td>{item.searchTime || ''}</td>,
        cacheFile: (item: IKeyword) => {
          if (!item.fileName) return <td></td>;
          const href = `${appEnv.SERVER_URL}/${item.fileName}`
          return (
            <td >
              <CLink href={href} target="_blank">
                {item.fileName}
              </CLink>
            </td>
          );
        },
      }}
      tableProps={{
        // striped: true,
        // hover: true,
        align: 'middle',
        responsive: 'xl',
        bordered: true,
      }}
    />
  );
};

export default Overview;
