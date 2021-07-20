import { FC } from "react";
import { addresses, contracts } from "@tender/contracts";
import { utils, BigNumberish } from "ethers";
import { useContractCall, useTokenAllowance } from "@usedapp/core";
import { Box, Grid } from "grommet";
import Farm from "./farm";
import Unfarm from "./unfarm";
import Harvest from "./harvest";
import InfoCard from "../tenderizers/infocard";

type Props = {
  name: string;
  symbol: string;
  account: string;
  lpTokenBalance: BigNumberish;
};

const TenderFarm: FC<Props> = ({ name, symbol, account, lpTokenBalance }) => {
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
    <Box flex={true} fill="horizontal">
      <Grid fill rows={["2/5", "2/5", "1/5"]} columns={["flex", "flex", "flex"]}>
        <Box gridArea="1 / 1 / 2 / 2" pad={{ horizontal: "small" }}>
          <InfoCard title={"Total Staked"} text={`${utils.formatEther(totalStake?.toString() || "0")} ${symbolFull}`} />
        </Box>
        <Box gridArea="1 / 2 / 2 / 3" pad={{ horizontal: "small" }}>
          <InfoCard title={"Total Rewards"} text={`0 tender${symbol}`} />
        </Box>
        <Box gridArea="1 / 3 / 2 / 4" pad={{ horizontal: "small" }}>
          <InfoCard title={"APY"} text={`10 %`} />
        </Box>
        <Box gridArea="2 / 1 / 3 / 2" pad={{ horizontal: "small" }}>
          <InfoCard title={`Pool Balance`} text={`${utils.formatEther(lpTokenBalance?.toString() || "0")} ${symbolFull}`} />
        </Box>
        <Box gridArea="2 / 2 / 3 / 3" pad={{ horizontal: "small" }}>
          <InfoCard title={"My stake"} text={`${utils.formatEther(stakeOf?.toString() || "0")} ${symbolFull}`} />
        </Box>
        <Box gridArea="2 / 3 / 3 / 4" pad={{ horizontal: "small" }}>
          <InfoCard
            title={"Available Rewards"}
            text={`${utils.formatEther(availableRewards?.toString() || "0")} tender${symbol}`}
          />
        </Box>
        <Box gridArea="3 / 1 / 4 / 2" pad={{ horizontal: "large", top: "medium" }}>
          <Farm
            name={name}
            symbol={symbolFull}
            tokenBalance={lpTokenBalance || "0"}
            tokenAllowance={lpTokenAllowance || "0"}
          />
        </Box>
        <Box gridArea="3 / 2 / 4 / 3" pad={{ horizontal: "large", top: "medium" }}>
          <Unfarm name={name} symbol={symbolFull} stake={stakeOf || "0"} />
        </Box>
        <Box gridArea="3 / 3 / 4 / 4" pad={{ horizontal: "large", top: "medium" }}>
          <Harvest name={name} symbol={`tender${symbol}`} availableRewards={availableRewards || "0"} />
        </Box>
      </Grid>
    </Box>
  );
};

export default TenderFarm;
