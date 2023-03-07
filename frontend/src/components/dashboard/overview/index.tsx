import {
  CNav,
  CNavItem,
  CNavLink, CTabContent,
  CTabPane
} from '@coreui/react-pro';
import { useState } from 'react';
import CsvOverview from './CsvOverview';
import KeywordsOverview from './KeywordsOverview';


const Overview = () => {
  const [activeKey, setActiveKey] = useState<number>(1);
  const [batchId, setBatchId] = useState<number>();

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
        <CsvOverview activeKey={activeKey} setActiveKey={setActiveKey} setBatchId={setBatchId} />
      </CTabPane>
      <CTabPane visible={activeKey === 2}>
        <KeywordsOverview activeKey={activeKey} setActiveKey={setActiveKey} batchId={batchId} />
      </CTabPane>
    </CTabContent>
  </>
  );
};


export default Overview;
