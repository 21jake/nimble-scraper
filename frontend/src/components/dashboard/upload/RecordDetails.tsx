import { CCol, CProgress, CProgressBar, CRow } from '@coreui/react-pro';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { appEnv } from 'src/config/constants';
import { RootState } from 'src/reducers';
import { useStopWatch } from 'src/utils/hooks/useStopWatch';

const RecordDetails = () => {
  const { initialState } = useSelector((state: RootState) => state.dashboard);

  const { start, stop, time, reset } = useStopWatch();

  const { batch, streaming } = initialState;

  useEffect(() => {
    if (streaming) {
      start();
    } else {
      stop();
    }

    return () => {
      reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streaming]);

  if (!batch)
    return (
      <CProgress className="my-3">
        <CProgressBar color="primary" variant="striped" animated value={0} />
      </CProgress>
    );

  const progress = (Number(batch.processedCount) / Number(batch.keywordCount)) * 100;

  return (
    <CRow className={`my-3`}>
      <CCol xs={12}>
        <CProgress className="mt-3">
          <CProgressBar color="primary" variant="striped" animated value={progress || 0} />
        </CProgress>
      </CCol>
      <CCol xs={12}>
        <h6 className="mt-3 lead">{`${batch.originalName}`}</h6>
      </CCol>
      <CCol xs={6}>
        <p>
          <span className={`fw-semibold`}>Processed:</span> {`${batch.processedCount} / ${batch.keywordCount}`}
        </p>
      </CCol>
      <CCol xs={6}>
        <p>
          <span className={`fw-semibold`}> Uploaded:</span>{' '}
          {`${dayjs(batch?.createdDate).format(appEnv.APP_DATE_FORMAT)}`}
        </p>
      </CCol>
      <CCol xs={6}>
        <p>
          <span className={`fw-semibold`}> Time:</span> {`${time}`}
        </p>
      </CCol>
    </CRow>
  );
};

export default RecordDetails;
