import React, { useEffect } from 'react'
import { useCountdown } from '../../hooks/useCountdown';
import ShowCounter from './ShowCounter';
import { useRouter } from "next/router";

const CountdownTimer = ({targetDate}) => {
  const [days, hours, minutes, seconds, timeIsOver] = useCountdown(targetDate);
  const router = useRouter();

  useEffect(() => {
    console.log("timeIsOver", timeIsOver);
    if (timeIsOver) {
      router.push("/");
    }
  }, [timeIsOver]);

  return (
    <>
      <img className="w-8 h-8" src="../assets/images/timer.png" alt=""/>
      <ShowCounter 
         days={days}
         hours={hours}
         minutes={minutes}
         seconds={seconds}
      />
    </>
  )
 
}

export default CountdownTimer