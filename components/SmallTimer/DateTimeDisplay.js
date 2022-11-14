import React from 'react'

const DateTimeDisplay = ({ value, type, isDanger }) => {
  return (
    <>
    <div className="mx-2 bg-cover bg-no-repeat  items-center justify-center">
        <div className={isDanger ? 'countdown danger' : 'countdown'}>
            <p className="bold text-md text-[#CF3810]">{value}</p>
            <span className=" text-white text-xs">{type}</span>
        </div>
    </div>

    </>
  )
}

export default DateTimeDisplay