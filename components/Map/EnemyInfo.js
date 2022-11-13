import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import LiquidityVault from "../../constants/LiquidityVault.json";
import networkMapping from "../../constants/networkMapping.json";
import LiquidityWars from "../../constants/LiquidityWars.json";
import { useNotification } from "web3uikit";

export default function EnemyInfo({ playerId }) {
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const [playerAddress, setPlayerAddress] = useState("");
  const [villageSize, setVillageSize] = useState(0);
  const dispatch = useNotification();
  const LiquidityVaultAddress =
    chainId in networkMapping
      ? networkMapping[chainId]["LiquidityVault"][0]
      : null;

  const LiquidityWarsAddress =
    chainId in networkMapping
      ? networkMapping[chainId]["LiquidityWars"][0]
      : null;

  // get playerAddress
  const { runContractFunction: getPlayerAddress } = useWeb3Contract({
    abi: LiquidityVault,
    contractAddress: LiquidityVaultAddress,
    functionName: "getPlayerAddress",
    params: { _id: playerId },
  });

  // get villageSize
  const { runContractFunction: getVillageSize } = useWeb3Contract({
    abi: LiquidityWars,
    contractAddress: LiquidityWarsAddress,
    functionName: "getVillageSize",
    params: { _playerAddress: playerAddress },
  });

  const { runContractFunction } = useWeb3Contract();

  // handle attack player success
  async function handleAttackSuccess() {
    dispatch({
      type: "success",
      message: "Check log for attack details",
      title: "Enemy Attacked",
      position: "topR",
    });
  }

  // attack player function
  async function handleAttackPlayer(playerToAttack) {
    const playerParams = {
      abi: LiquidityWars,
      contractAddress: LiquidityWarsAddress,
      functionName: "attackPlayer",
      params: { _playerToAttack: playerToAttack },
    };

    await runContractFunction({
      params: playerParams,
      onSuccess: () => handleAttackSuccess(),
      onError: (error) => console.log(error),
    });
  }

  async function updateUI() {
    const getPlayerAddresses = (await getPlayerAddress()).toString();
    setPlayerAddress(getPlayerAddresses);
    const getVillageSizes = (await getVillageSize())?.toString();
    setVillageSize(getVillageSizes);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [playerId, playerAddress]);

  return (
    <div className="flex flex-col w-[250px] h-full justify-between">
      <div className="text-xl font-bold text-gray-700 mb-8">
        <div>Player Id: {playerId}</div>
        <div className="truncate">
          Player Address:{" "}
          {playerAddress.toLowerCase() == account.toLowerCase()
            ? "You"
            : playerAddress}
        </div>
        <div>Village Size: {villageSize}</div>
      </div>

      {playerAddress.toLowerCase() !== account.toLowerCase() && (
        <button
          onClick={() => handleAttackPlayer(playerAddress)}
          className="m-auto mb-4 text-white font-semibold p-3 rounded-md bg-cover w-[150px] bg-[url('/assets/images/valley-button.png')]"
        >
          <div className="flex items-center justify-center p-1">
            <img
              src="/assets/images/attack_icon.png"
              alt="attack enemy"
              className="h-[20px]"
            />{" "}
            <div> Attack Player</div>
          </div>
        </button>
      )}
    </div>
  );
}
