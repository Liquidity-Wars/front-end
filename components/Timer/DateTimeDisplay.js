import React from 'react'

const DateTimeDisplay = ({ value, type, isDanger }) => {
  return (
    <>
    <div className="bg-[url('/assets/images/timer_frame.png')] mx-4 my-4 bg-cover bg-no-repeat w-20 h-20 items-center justify-center">
        <div className={isDanger ? 'countdown danger' : 'countdown'}>
            <p className="font-['Stardew'] text-4xl text-[#CF3810]">{value}</p>
            <span className="font-['Nabana-bold'] text-xl">{type}</span>
        </div>
    </div>

    </>
  )
}

export default DateTimeDisplay