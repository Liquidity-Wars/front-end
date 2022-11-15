import React, { useState,  createRef ,useEffect} from 'react'
import { createPopper } from "@popperjs/core";

const Selector = ({allowedLPTokens, allowedLPAddresses, selected, setSelected }) => {
    const [lpTokens, setLpTokens] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
      let tokenArr = [];
      let tokenObject = {
        address: allowedLPAddresses[0],
        name: allowedLPTokens[0]
      }
      tokenArr.push(tokenObject)
      setLpTokens(tokenArr);
    }, [open]);


  return (
    <>
     <div className="font-medium items-center w-2/5">
      <div
        onClick={() => setOpen(!open)}
        className={`cursor-pointer bg-[#F3B46C] border-[#AB4A05] mx-2 border-4 w-full p-2 flex items-center text-sm justify-between rounded font-['Nabana-bold'] ${
          !selected && " text-[#CF3810]"
        }`}
      >
        {selected
          ? selected?.length > 25
            ? selected?.name.substring(0, 25) + "..."
            : selected?.name
          : (
            <p className="text-base">Select Token!</p>
          )}
       
      </div>
      <ul
        className={`bg-[#F3B46C] border-[#AB4A05]  text-[#CF3810] absolute mt-2 w-72 overflow-y-auto ${
          open ? "max-h-60 border-2 " : "max-h-0"
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
        {lpTokens?.map((lpToken) => (
          <li
            key={lpToken?.name}
            className={`p-2 text-xs hover:bg-sky-600 hover:text-white
            ${
              lpToken?.name?.toLowerCase() === selected?.name?.toLowerCase() &&
              "bg-[#FFCA7A] border-[#AB4A05] border-2  text-[#CF3810] text-sm"
            }
            ${
              lpToken?.name?.toLowerCase().startsWith(inputValue)
                ? "block"
                : "hidden"
            }`}
            onClick={() => {

              if (lpToken?.name?.toLowerCase() !== selected?.name?.toLowerCase()) {
                setSelected(lpToken);
                setOpen(false);
                setInputValue("");

              } else {
                console.log(lpTokens)

              }
            }}
          >
            {lpToken?.name}
          </li>
        ))}
      </ul>
    </div>
    </>
  )
}

export default Selector