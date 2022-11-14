import React from 'react'
import DateTimeDisplay from './DateTimeDisplay';

const ShowCounter = ({ days, hours, minutes, seconds }) => {
  return (
    <>  
        <div className="flex flex-row items-center">
      
            <DateTimeDisplay value={days} type={'Days'} isDanger={false} />
            <DateTimeDisplay value={hours} type={'Hour '} isDanger={false} />
            <DateTimeDisplay value={minutes} type={'Mins'} isDanger={false} />
            <DateTimeDisplay value={seconds} type={'Sec'} isDanger={false} />
        </div>
    </>
  )
}

export default ShowCounter