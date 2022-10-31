import React, { useEffect, useState } from 'react'
import ModelViewer from '@metamask/logo';


const MetaMaskLogo = () => {

    // const [metamask, setMetaMask] = useState();
 

    async function updateUI(){
        const viewer = ModelViewer({
            pxNotRatio: true,
            width: 50,
            height: 50,
            followMouse: true,
        })
    }


    useEffect(() =>{
        updateUI()
    },[]);

  return (
    <>
        metakmask logo
        <div>
            {/* {metamask.map(obj => <div>{obj}</div>)} */}
        </div>
    </>
  )
}

export default MetaMaskLogo