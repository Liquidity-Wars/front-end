import React from 'react'


const ConnectToWallet = () => {
  return (
    <>
      <div className="bg-transparent  ">
            <div className="bg-[url('/assets/images/Web3Frame.png')] flex justify-center w-64 h-64 bg-cover bg-no-repeat">
                <div className="flex flex-col font-['Nabana-bold'] justify-center text-lg items-center text-center px-6">
                  Please Connect your Wallet to start the game.<br/>
                  At the moment we are only available at <u>Polygon Testnet Mumbai</u>
                  <img
                      className="w-12 h-12" 
                      src="/assets/images/wallet.png" />
                </div>
            </div>
        </div>
    </>
  )
}

export default ConnectToWallet