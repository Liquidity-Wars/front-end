import React from 'react'
import { useCountdown } from '../../hooks/useCountdown';
import ShowCounter from './ShowCounter';
import ExpiredNotice from './ExpiredNotice';

const CountdownTimer = ({targetDate}) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate)

  if(days + hours+ minutes + seconds <= 0){
    return <ExpiredNotice />
  } else {
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
 
}

export default CountdownTimer