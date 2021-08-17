import { FC, useEffect } from "react";
import { addresses, contracts } from "@tender/contracts";
import { BigNumberish } from "ethers";
import { useContractCall } from "@usedapp/core";
import { useQuery } from "@apollo/client";
import { Box } from "grommet";
import Farm from "./farm";
import Unfarm from "./unfarm";
import Harvest from "./harvest";
import InfoCard from "../tenderizers/infocard";
import { GetUserDeployments, UserDeploymentsType } from "../../pages/token/queries";
import { weiToEthWithDecimals } from "../../utils/amountFormat";

type Props = {
  name: string;
  symbol: string;
  account: string;
  lpTokenBalance: BigNumberish;
};

const TenderFarm: FC<Props> = ({ name, symbol, account, lpTokenBalance }) => {
  const symbolFull = `POOL-t${symbol}-${symbol}`;

  const stakeOf = useContractCall({
    abi: contracts[name].farm.interface,
    address: addresses[name].farm.toLowerCase(),
    method: "stakeOf",
    args: [account],
  });

  // const totalStake = useContractCall({
  //   abi: contracts[name].farm.interface,
  //   address: addresses[name].farm,
  //   method: "nextTotalStake",
  //   args: [],
  // });

  const availableRewards = useContractCall({
    abi: contracts[name].farm.interface,
    address: addresses[name].farm,
    method: "availableRewards",
    args: [account],
  });

  const subgraphName = name.charAt(0).toUpperCase() + name.slice(1);
  const { data: userData, refetch } = useQuery<UserDeploymentsType>(GetUserDeployments, {
    variables: { id: `${account?.toLowerCase()}_${subgraphName}` },
  });

  // update my stake when tokenBalance changes
  useEffect(() => {
    refetch();
  }, [refetch, availableRewards]);

  return (
    <Box>
      <Box justify="around" direction="row" pad={{ bottom: "medium" }}>
        <Box>
          <InfoCard
            title={"Pool Tokens Staked"}
            text={`${weiToEthWithDecimals(stakeOf?.toString() || "0", 3)} ${symbolFull}`}
            subText={`Balance: ${weiToEthWithDecimals(lpTokenBalance?.toString() || "0", 3)}`}
          />
        </Box>
        <Box>
          <InfoCard
            title={"Harvestable Rewards"}
            text={`${weiToEthWithDecimals(availableRewards?.toString() || "0", 3)} tender${symbol}`}
          />
        </Box>
        <Box>
          <InfoCard
            title={"Total Harvested"}
            text={`${weiToEthWithDecimals(
              userData?.userDeployments?.[0]?.farmHarvest?.toString() || "0",
              3
            )} tender${symbol}`}
          />
        </Box>
      </Box>
      <Box flex justify="around" align="center" direction="row" pad={{ bottom: "large" }}>
        <Farm name={name} symbol={symbolFull} tokenBalance={lpTokenBalance || "0"} />
        <Unfarm name={name} symbol={symbolFull} stake={stakeOf || "0"} />
        <Harvest name={name} symbol={`tender${symbol}`} availableRewards={availableRewards || "0"} />
      </Box>
      {/* <Box gap="large" justify="center" direction="row">
        <Box
          border={{ side: "top" }}
          gap="large"
          justify="center"
          direction="row"
          pad={{ top: "large", horizontal: "medium" }}
        >
          <Box>
            <InfoCard
              title={"Total Staked"}
              text={`${utils.formatEther(totalStake?.toString() || "0")} ${symbolFull}`}
            />
          </Box>
          <Box>
            <InfoCard
              title={"Total Rewards"}
              text={`${weiToEthWithDecimals(data?.deployment?.tenderizer.rewards ?? "0", 4)} tender${symbol}`}
            />
          </Box>
          <Box>
            <InfoCard title={"APY"} text={`10 %`} />
          </Box>
        </Box>
      </Box> */}
    </Box>
  );
};

export default TenderFarm;
