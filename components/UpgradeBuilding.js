import { useEffect, useState } from "react";

export default function UpgradeBuilding({ handleClose, buildingType }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    await startPayment({
      setError,
      dispatch,
      ether: data.get("ether"),
      addr: data.get("addr"),
    });
  };
  return (
    <div className="flex flex-col items-center justify-center h-full w-full rounded-md bg-cover bg-[url('/assets/images/Web3Frame.png')]">
      <button onClick={handleClose} className="m-auto flex mt-2 mr-4">
        <div className="text-red-500 font-semibold">Close</div>
      </button>
      <form className="m-auto items-center" onSubmit={handleSubmit}>
        <div>
          <main className="p-4">
            <div className="text-2xl font-bold text-gray-700 text-center mb-14">
              {buildingType}
              <div className="text-sm font-bold text-gray-700">Level:</div>
            </div>
            <h1 className="text-2xl font-bold text-gray-700 text-center mb-3">
              Stats
            </h1>
            <div>Cost of Upgrade:</div>
            <div>Current Ability:</div>
            <div>Next Ability:</div>
            <div className=""></div>
          </main>
          <footer className="p-4">
            <button
              type="submit"
              className="btn btn-primary text-white p-3 rounded-md bg-cover w-[130px] bg-[url('/assets/images/valley-button.png')]"
            >
              Upgrade
            </button>
          </footer>
        </div>
      </form>
    </div>
  );
}
