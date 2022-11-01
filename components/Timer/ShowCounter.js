import React from 'react'
import DateTimeDisplay from './DateTimeDisplay';

const ShowCounter = ({ days, hours, minutes, seconds }) => {
  return (
    <>
        <div className="flex flex-row items-center">
            <DateTimeDisplay value={hours} type={'Hours'} isDanger={false} />
            <img src='../assets/images/horseEMOJI.png' className="w-4 h-4" alt="horse"/>
            <DateTimeDisplay value={minutes} type={'Mins'} isDanger={false} />
            <img src='../assets/images/horseEMOJI.png' className="w-4 h-4" alt="horse"/>
            <DateTimeDisplay value={seconds} type={'Seconds'} isDanger={false} />
        </div>
    </>
  )
}

export default ShowCounter