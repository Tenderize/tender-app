import { FC } from "react";
import { addresses, contracts } from "@tender/contracts";
import { utils, BigNumberish } from "ethers";
import { useContractCall, useTokenAllowance } from "@usedapp/core";

import Farm from "./farm";
import Unfarm from "./unfarm";
import Harvest from "./harvest";
import InfoCard from "./infocard";

type Props = {
  name: string;
  symbol: string;
  account: string;
  lpTokenBalance: BigNumberish;
};

const TenderFarm: FC<Props> = ({ name, symbol, account, lpTokenBalance}) => {
  const symbolFull = `t${symbol}-${symbol} Pool Token`;

  // Contract state
  const lpTokenAllowance = useTokenAllowance(addresses[name].liquidity, account, addresses[name].farm);

  const stakeOf = useContractCall({
    abi: contracts[name].farm.interface,
    address: addresses[name].farm.toLowerCase(),
    method: "stakeOf",
    args: [account],
  });

  const totalStake = useContractCall({
    abi: contracts[name].farm.interface,
    address: addresses[name].farm,
    method: "nextTotalStake",
    args: [],
  });

  const availableRewards = useContractCall({
    abi: contracts[name].farm.interface,
    address: addresses[name].farm,
    method: "availableRewards",
    args: [account],
  });

  return (
    <>
      <div className="d-flex justify-content-around">
        <InfoCard
          color={"primary"}
          title={"Total Staked"}
          text={`${utils.formatEther(totalStake?.toString() || "0")} ${symbolFull}`}
        />
        <InfoCard color={"secondary"} title={"Total Rewards"} text={` tender${symbol}`} />
        <InfoCard color={"info"} title={"APY"} text={`10%`} />
      </div>
      <div className="d-flex justify-content-around">
        <InfoCard
          color={"info"}
          title={`${symbolFull} Balance`}
          text={`${utils.formatEther(lpTokenBalance?.toString() || "0")}`}
        />
        <InfoCard
          color={"secondary"}
          title={"My stake"}
          text={`${utils.formatEther(stakeOf?.toString() || "0")} ${symbolFull}`}
        />
        <InfoCard
          color={"primary"}
          title={"Available Rewards"}
          text={`${utils.formatEther(availableRewards?.toString() || "0")} tender${symbol}`}
        />
      </div>
      <div className="d-flex justify-content-around">
        <Farm
          name={name}
          symbol={symbolFull}
          tokenBalance={lpTokenBalance || "0"}
          tokenAllowance={lpTokenAllowance || "0"}
        />
        <Unfarm name={name} symbol={symbolFull} stake={stakeOf || "0"} />
        <Harvest name={name} symbol={`tender${symbol}`} availableRewards={availableRewards || "0"} />
      </div>
    </>
  );
};

export default TenderFarm;
