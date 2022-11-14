import React from 'react'

const DateTimeDisplay = ({ value, type, isDanger }) => {
  return (
    <>
    <div className=" bg-[url('/assets/images/timer_frame.png')] w-8 h-8 mx-1 bg-cover bg-no-repeat  items-center justify-center">
        <div className="">
            <p className="font-bold text-center text-xs text-[#CF3810]">{value}</p>
            <span className=" text-white text-center text-[0.65rem] relative top-[-8px] mx-1.5">{type}</span>
        </div>
    </div>

    </>
  )
}

export default DateTimeDisplay