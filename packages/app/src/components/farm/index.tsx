import { FC, useEffect } from "react";
import { abis, addresses } from "@tender/contracts/src/index";
import { BigNumberish, constants, Contract, utils } from "ethers";
import { useCall } from "@usedapp/core";
import { useQuery } from "@apollo/client";
import { Box, Text } from "grommet";
import Farm from "./farm";
import Unfarm from "./unfarm";
import Harvest from "./harvest";
import { InfoCard, Queries, stakers } from "@tender/shared/src/index";
import { weiToEthWithDecimals } from "utils/amountFormat";
import { useIsCorrectChain } from "utils/useEnsureRinkebyConnect";
import { SwitchNetwork } from "components/account/SwitchNetwork";
import { TenderFarm as TenderFarmContract } from "@tender/contracts/gen/types";
import { ProtocolName } from "@tender/shared/src/data/stakers";

type Props = {
  protocolName: ProtocolName;
  symbol: string;
  account: string;
  lpTokenBalance: BigNumberish;
};

const TenderFarm: FC<Props> = ({ protocolName, symbol, account, lpTokenBalance }) => {
  const symbolFull = `t${symbol}-SWAP`;
  const requiredChain = stakers[protocolName].chainId;
  const isCorrectChain = useIsCorrectChain(requiredChain);

  const farmContract = new Contract(
    addresses[protocolName].tenderFarm,
    new utils.Interface(abis.tenderFarm)
  ) as TenderFarmContract;

  const stakeOfResult = useCall({
    contract: farmContract,
    method: "stakeOf",
    args: [account],
  });

  const stakeOf = stakeOfResult?.value?.[0] ?? constants.Zero;

  const availableRewardsResult = useCall({
    contract: farmContract,
    method: "availableRewards",
    args: [account],
  });

  const availableRewards = availableRewardsResult?.value?.[0] ?? constants.Zero;

  const subgraphName = stakers[protocolName].subgraphId;
  const { data: userData, refetch } = useQuery<Queries.UserDeploymentsType>(Queries.GetUserDeployments, {
    variables: { id: `${account?.toLowerCase()}_${subgraphName}` },
    context: { chainId: stakers[protocolName].chainId },
  });

  // update my stake when tokenBalance changes
  useEffect(() => {
    refetch();
  }, [refetch, availableRewards]);

  return (
    <Box>
      <Box justify="evenly" gap="large" direction="row" pad={{ bottom: "medium" }}>
        <Box direction="column" gap="large" align="center">
          <InfoCard
            title={"Swap Tokens Staked"}
            text={`${weiToEthWithDecimals(stakeOf?.toString() || "0", 3)} ${symbolFull}`}
            align="center"
          />
          {isCorrectChain && (
            <Box direction="column" gap="small" align="center">
              <Farm protocolName={protocolName} symbol={symbolFull} tokenBalance={lpTokenBalance || "0"} />
              <Text size="small">{`Balance: ${weiToEthWithDecimals(
                lpTokenBalance?.toString() || "0",
                3
              )} ${symbolFull}`}</Text>
            </Box>
          )}
        </Box>
        <Box direction="column" gap="large" align="center">
          <InfoCard
            title={"Available Rewards"}
            text={`${weiToEthWithDecimals(availableRewards?.toString() || "0", 3)} tender${symbol}`}
            align="center"
          />
          {isCorrectChain && (
            <Unfarm protocolName={protocolName} symbol={symbolFull} stake={stakeOf?.toString() ?? "0"} />
          )}
        </Box>
        <Box direction="column" gap="large" align="center">
          <InfoCard
            title={"Total Harvested"}
            align="center"
            text={`${weiToEthWithDecimals(
              userData?.userDeployments?.[0]?.farmHarvest?.toString() || "0",
              3
            )} tender${symbol}`}
          />
          {isCorrectChain && (
            <Harvest
              protocolName={protocolName}
              symbol={`tender${symbol}`}
              availableRewards={availableRewards || "0"}
            />
          )}
        </Box>
      </Box>
      {!isCorrectChain && isConnected(account) && (
        <Box justify="center" align="center" pad={{ vertical: "large" }}>
          <SwitchNetwork chainId={requiredChain} protocol={stakers[protocolName].title} />
        </Box>
      )}
    </Box>
  );
};

const isConnected = (account: string) => account && account !== constants.AddressZero;

export default TenderFarm;
