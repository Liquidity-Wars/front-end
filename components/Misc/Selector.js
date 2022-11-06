import React, { useState,  createRef ,useEffect} from 'react'
import { createPopper } from "@popperjs/core";

const Selector = () => {

    const [countries, setCountries] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [selected, setSelected] = useState("");
    const [open, setOpen] = useState(false);
  
    useEffect(() => {
      fetch("https://restcountries.com/v2/all?fields=name")
        .then((res) => res.json())
        .then((data) => {
          setCountries(data);
        });
    }, []);


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
        {/* <div className="flex items-center px-2 sticky top-0 bg-white">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.toLowerCase())}
            placeholder="Enter country name"
            className="placeholder:text-gray-700 p-2 outline-none"
          />
        </div> */}
        <li className='p-2 text-sm hover:bg-sky-600 hover:text-white'>
            Token1
        </li>
        {/* {countries?.map((country) => (
          <li
            key={country?.name}
            className={`p-2 text-sm hover:bg-sky-600 hover:text-white
            ${
              country?.name?.toLowerCase() === selected?.toLowerCase() &&
              "bg-sky-600 text-white"
            }
            ${
              country?.name?.toLowerCase().startsWith(inputValue)
                ? "block"
                : "hidden"
            }`}
            onClick={() => {
              if (country?.name?.toLowerCase() !== selected.toLowerCase()) {
                setSelected(country?.name);
                setOpen(false);
                setInputValue("");
              }
            }}
          >
            {country?.name}
          </li>
        ))} */}
      </ul>
    </div>
    </>
  )
}

export default Selector