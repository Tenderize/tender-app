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
    <>
      <Grid
          fill
          rows={["2/5", "2/5", "1/5"]}
          // columns={["1"]}
          // gap="small"
          // areas={[
          //   { name: "generalStats", start: [0, 0], end: [1, 0] },
          //   { name: "userStats", start: [0, 1], end: [1, 1] },
          //   { name: "actions", start: [0, 2], end: [1, 2]}
          // ]}
        >
            <Box flex fill="horizontal" direction="row" justify="center" pad="medium">
              <InfoCard
                title={"Total Staked"}
                text={`${utils.formatEther(totalStake?.toString() || "0")} ${symbolFull}`}
              />
              <InfoCard title={"Total Rewards"} text={`0 tender${symbol}`} />
              <InfoCard title={"APY"} text={`10 %`} />
            </Box>

            <Box flex fill="horizontal" direction="row" justify="center" pad="medium">
              <InfoCard
                title={`Pool Balance`}
                text={`${utils.formatEther(lpTokenBalance?.toString() || "0")}`}
              />
              <InfoCard
                title={"My stake"}
                text={`${utils.formatEther(stakeOf?.toString() || "0")} ${symbolFull}`}
              />
              <InfoCard
                title={"Available Rewards"}
                text={`${utils.formatEther(availableRewards?.toString() || "0")} tender${symbol}`}
              />
            </Box>

            <Box fill="horizontal" direction="row"justify="between" pad={{horizontal: "xlarge"}}>
              <Farm
                name={name}
                symbol={symbolFull}
                tokenBalance={lpTokenBalance || "0"}
                tokenAllowance={lpTokenAllowance || "0"}
              />
              <Unfarm name={name} symbol={symbolFull} stake={stakeOf || "0"} />
              <Harvest name={name} symbol={`tender${symbol}`} availableRewards={availableRewards || "0"} />
            </Box>

        </Grid>
    </>
  );
};

export default TenderFarm;
