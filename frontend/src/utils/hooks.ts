import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export const useRouter = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  //   const match = useMatch;
  const redirectView = (url: string) => () => {
    navigate(`${url}`);
  };

  return { params, location, navigate, redirectView };
};

export const useStopWatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeWhenLastStopped, setTimeWhenLastStopped] = useState<number>(0);

  const interval = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (startTime > 0) {
      interval.current = setInterval(() => {
        setTime(() => Date.now() - startTime + timeWhenLastStopped);
      }, 1);
    } else {
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = undefined;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime]);

  const start = () => {
    setIsRunning(true);
    setStartTime(Date.now());
  };

  const stop = () => {
    setIsRunning(false);
    setStartTime(0);
    setTimeWhenLastStopped(time);
  };

  return {
    start,
    stop,
    isRunning,
    time,
  };
};
