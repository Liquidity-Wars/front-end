export default function PlayerGrid({ playerId, setPlayerId }) {
  return (
    <div>
      <div
        className="w-[78px] h-[78px] border-slate-300 hover:border-2 ml-[-2px] mt-[-2px] bg-cover bg-[url('/assets/images/village_icon.png')]"
        onClick={() => setPlayerId(playerId)}
      ></div>
    </div>
  );
}
