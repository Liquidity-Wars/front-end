export default function AttackEvent({
  index,
  type,
  attackersLeft,
  defendersLeft,
  robbedResources,
}) {
  return (
    <div className="bg-white border-[1px] border-black w-[340px] flex">
      <div className="p-2 bg-slate-300">{index}</div>
      <div className="w-full">
        <div
          className={
            type === "Attacked"
              ? "bg-red-700 text-white font-lg pl-1"
              : "bg-blue-300 text-white font-lg pl-1"
          }
        >
          {type}
        </div>
        <div className="pl-1">Resources Stolen: {robbedResources}</div>
        <div className="pl-1">
          <div>No. of Attacker Troops Survived: {attackersLeft}</div>
          <div>No. of Defender Troops Survived: {defendersLeft}</div>
        </div>
      </div>
    </div>
  );
}
