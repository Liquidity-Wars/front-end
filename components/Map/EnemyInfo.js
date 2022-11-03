export default function EnemyInfo({ playerId }) {
  return (
    <div className="flex flex-col w-full h-full justify-center p-2">
      <div className="text-xl font-bold text-gray-700 mb-8">
        <div>Player Id: {playerId}</div>
        <div>Player Address:</div>
      </div>

      <button className="m-auto text-white font-semibold p-3 rounded-md bg-cover w-[130px] bg-[url('/assets/images/valley-button.png')]">
        Attack Player
      </button>
    </div>
  );
}
