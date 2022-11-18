import { useEffect, useState } from 'react';

const useCountdown = (targetDate) => {
  const countDownDate = new Date(targetDate);

  const [countDown, setCountDown] = useState(
    countDownDate - new Date() <= 0 ? 0 : countDownDate - new Date()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const dateDif = countDownDate - new Date();
      setCountDown(dateDif <= 0 ? 0 : dateDif);
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  return getReturnValues(countDown);
};

const getReturnValues = (countDown) => {
  // calculate time left
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  const timeIsOver = days + hours+ minutes + seconds <= 0;

  return [days, hours, minutes, seconds, timeIsOver];
};

export { useCountdown };