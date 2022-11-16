import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import LiquidityVault from "../../constants/LiquidityVault.json";
import networkMapping from "../../constants/networkMapping.json";
import LiquidityWars from "../../constants/LiquidityWars.json";
import { useNotification } from "web3uikit";
import { ethers } from "ethers";

export default function EnemyInfo({ playerId }) {
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const [playerAddress, setPlayerAddress] = useState("");
  const [villageSize, setVillageSize] = useState(0);
  const dispatch = useNotification();
  const [warsContract, setWarsContract] = useState();
  const [isAttacking, setIsAttacking] = useState(false);
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

  async function handleAttackPlayer(playerToAttack) {
    if(isAttacking) {
      return;
    }
    try {
      setIsAttacking(true);
      const provider = new ethers.providers.Web3Provider(ethereum);
      const liquidityWarsContract = new ethers.Contract(LiquidityWarsAddress, LiquidityWars, provider.getSigner());
      setWarsContract(liquidityWarsContract);
      const txn = await liquidityWarsContract.attackPlayer(playerToAttack);
    } catch (error) {
      setIsAttacking(false);
      dispatch({
        type: "error",
        message: error.reason,
        title: "Failed to attack",
        position: "topR",
      });
    }
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

  useEffect(() => {

    const onAttackHappenned = (attacker,defender,gameId,attackerTroopsSurvived,defenderTroopsSurvived,robbedResources) => {
      console.log(`Attack event arrived: ${attacker} | ${defender} | ${gameId} | ${attackerTroopsSurvived} | ${defenderTroopsSurvived} | ${robbedResources}`);
      dispatch({
        type: "success",
        message: "Attack was successfully. Check the log for attack details",
        title: "Enemy Attacked",
        position: "topR",
      });
      setIsAttacking(false);
    };

    if (warsContract) {
      warsContract.on('AttackHappenned', onAttackHappenned);
    }

    return () => {
      if (warsContract) {
        warsContract.off('AttackHappenned', onAttackHappenned);
      }
    }
  }, [warsContract])

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
            <div>{isAttacking ? "Attacking..." : "Attack Player"} </div>
          </div>
        </button>
      )}
    </div>
  );
}
