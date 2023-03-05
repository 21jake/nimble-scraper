import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CBadge } from '@coreui/react-pro';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'src/utils/hooks';

interface IWelcomeProps {
  isFirstTime: boolean;
}

const Welcome = ({ isFirstTime }: IWelcomeProps) => {
  const [visible, setVisible] = useState(false);
  const { navigate } = useRouter();

  useEffect(() => {
    if (isFirstTime) {
      setVisible(true);
    }
  }, [isFirstTime]);

  const navigateAndClose = (path: string) => {
    setVisible(false);
    navigate(path);
  };

  const navigateToUpload = () => {
    navigateAndClose('/dashboard/upload');
  };

  return (
    <CModal visible={visible} onClose={() => setVisible(false)} >
      <CModalHeader>
        <CModalTitle>Hey new user! Let's keep our things simple 🤙</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p>
          <CBadge className={`cursor-pointer`} color="success" onClick={navigateToUpload}>
            Upload Page
          </CBadge>{' '}
          to upload your CSV files
        </p>
        <p>
          <CBadge className={`cursor-pointer`} color="info" onClick={() => navigateAndClose('/dashboard')}>
            Overview Page
          </CBadge>{' '}
          to see the uploaded records{' '}
        </p>
        <p>
          Since you're new here, we recommend you to{' '}
          <span onClick={navigateToUpload} className={`text-info cursor-pointer`}>
            make an upload{' '}
          </span>{' '}
          first to get the hang of it. Have fun scraping!
        </p>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={() => setVisible(false)}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default Welcome;
