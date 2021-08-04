import { FC } from "react";
import { addresses, contracts } from "@tender/contracts";
import { utils, BigNumberish } from "ethers";
import { useContractCall } from "@usedapp/core";
import { useQuery } from "@apollo/client";
import { Box, Grid } from "grommet";
import Farm from "./farm";
import Unfarm from "./unfarm";
import Harvest from "./harvest";
import InfoCard from "../tenderizers/infocard";
import { GetDeployments } from "../../pages/token/queries";
import { weiToEthWithDecimals } from "../../utils/amountFormat";

type Props = {
  name: string;
  symbol: string;
  account: string;
  lpTokenBalance: BigNumberish;
};

const TenderFarm: FC<Props> = ({ name, symbol, account, lpTokenBalance }) => {
  const symbolFull = `t${symbol}-${symbol} Pool Token`;

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

  const { data } = useQuery(GetDeployments, {
    variables: { id: name },
  });

  return (
    <Box flex fill="horizontal">
      <Grid fill rows={["2/5", "2/5", "1/5"]} columns={["flex", "flex", "flex"]}>
        <Box gridArea="1 / 1 / 2 / 2" pad={{ left: "large" }}>
          <InfoCard title={"Total Staked"} text={`${utils.formatEther(totalStake?.toString() || "0")} ${symbolFull}`} />
        </Box>
        <Box gridArea="1 / 2 / 2 / 3" pad={{ left: "large" }}>
          <InfoCard
            title={"Total Rewards"}
            text={`${weiToEthWithDecimals(data?.deployment?.tenderizer.rewards ?? "0", 4)} tender${symbol}`}
          />
        </Box>
        <Box gridArea="1 / 3 / 2 / 4" pad={{ left: "large" }}>
          <InfoCard title={"APY"} text={`10 %`} />
        </Box>
        <Box gridArea="2 / 1 / 3 / 2" pad={{ left: "large" }}>
          <InfoCard
            title={`Pool Balance`}
            text={`${utils.formatEther(lpTokenBalance?.toString() || "0")} ${symbolFull}`}
          />
        </Box>
        <Box gridArea="2 / 2 / 3 / 3" pad={{ left: "large" }}>
          <InfoCard title={"My stake"} text={`${utils.formatEther(stakeOf?.toString() || "0")} ${symbolFull}`} />
        </Box>
        <Box gridArea="2 / 3 / 3 / 4" pad={{ left: "large" }}>
          <InfoCard
            title={"Available Rewards"}
            text={`${utils.formatEther(availableRewards?.toString() || "0")} tender${symbol}`}
          />
        </Box>
        <Box gridArea="3 / 1 / 4 / 2" pad={{ left: "large", right: "xlarge", top: "medium" }}>
          <Farm name={name} symbol={symbolFull} tokenBalance={lpTokenBalance || "0"} />
        </Box>
        <Box gridArea="3 / 2 / 4 / 3" pad={{ left: "large", right: "xlarge", top: "medium" }}>
          <Unfarm name={name} symbol={symbolFull} stake={stakeOf || "0"} />
        </Box>
        <Box gridArea="3 / 3 / 4 / 4" pad={{ left: "large", right: "xlarge", top: "medium" }}>
          <Harvest name={name} symbol={`tender${symbol}`} availableRewards={availableRewards || "0"} />
        </Box>
      </Grid>
    </Box>
  );
};

export default TenderFarm;
