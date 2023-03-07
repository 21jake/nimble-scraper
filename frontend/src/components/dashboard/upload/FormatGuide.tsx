import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react-pro';
import { useState } from 'react';

interface IFormatGuideProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const FormatGuide = ({visible, setVisible}: IFormatGuideProps) => {
//   const [visible, setVisible] = useState(true);
  return (
    <>
      {/* <CButton onClick={() => setVisible(!visible)}>Launch demo modal</CButton> */}
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>File Format</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p className="mb-2">
            1. Your file must have the <code>.csv</code> extension{' '}
          </p>
          <p className="mb-2">
            2. Each keyword is separated by a <code>linebreak</code>{' '}
          </p>
          <p className="mb-2">
            3. Number of keywords can range  <code>from 1 to more than 100</code>{' '}
          </p>
          <p className="mb-2">4. Below is an example file with <code>4 keywords</code> </p>

          <p className="text-medium-emphasis small color-secondary mb-1">{`example.csv`}</p>
          <div className={`border p-2`}>
            <p className="text-medium-emphasis mb-0 color-secondary">{`How to center a div`}</p>
            <p className="text-medium-emphasis mb-0 color-secondary">{`Where to find horses`}</p>
            <p className="text-medium-emphasis mb-0 color-secondary">{`How to train your dragon`}</p>
            <p className="text-medium-emphasis mb-0 color-secondary">{`Cats food`}</p>
          </div>
        </CModalBody>
        <CModalFooter className={`border-0`}>
          <CButton color="primary" onClick={() => setVisible(false)}>
            Understood
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default FormatGuide;
