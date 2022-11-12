import React, { useState,  createRef ,useEffect} from 'react'
import { createPopper } from "@popperjs/core";

const Selector = () => {

    // const [countries, setCountries] = useState(null);
    // const [inputValue, setInputValue] = useState("");
    const [selected, setSelected] = useState("");
    const [open, setOpen] = useState(false);
  


  return (
    <>
     <div className="w-72 font-medium ">
      <div
        onClick={() => setOpen(!open)}
        className={`bg-white w-full p-2 flex items-center justify-between rounded ${
          !selected && "text-gray-700"
        }`}
      >
        {selected
          ? selected?.length > 25
            ? selected?.substring(0, 25) + "..."
            : selected
          : "Select Nation"}
       
      </div>
      <ul
        className={`bg-white absolute mt-2 w-72 overflow-y-auto ${
          open ? "max-h-60" : "max-h-0"
        } `}
      >
        <li className='p-2 text-sm hover:bg-sky-600 hover:text-white'>
            Token1
        </li>

      </ul>
    </div>
    </>
  )
}

export default Selector