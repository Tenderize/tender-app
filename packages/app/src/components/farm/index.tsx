import { FC, useEffect } from "react";
import { addresses, contracts } from "@tender/contracts";
import { BigNumberish } from "ethers";
import { useContractCall } from "@usedapp/core";
import { useQuery } from "@apollo/client";
import { Box, Text } from "grommet";
import Farm from "./farm";
import Unfarm from "./unfarm";
import Harvest from "./harvest";
import { InfoCard, Queries } from "@tender/shared/src/index";
import { weiToEthWithDecimals } from "utils/amountFormat";
import stakers from "data/stakers";
import {useIsCorrectChain} from 'utils/useEnsureRinkebyConnect'
import {SwitchNetwork} from 'components/account/SwitchNetwork'

type Props = {
  protocolName: string;
  symbol: string;
  account: string;
  lpTokenBalance: BigNumberish;
};

const TenderFarm: FC<Props> = ({ protocolName, symbol, account, lpTokenBalance }) => {
  const symbolFull = `t${symbol}-${symbol}-SWAP`;
  const requiredChain = stakers[protocolName].chainId;
  const isCorrectChain = useIsCorrectChain(requiredChain)

  const stakeOf = useContractCall({
    abi: contracts[protocolName].tenderFarm.interface,
    address: addresses[protocolName].tenderFarm.toLowerCase(),
    method: "stakeOf",
    args: [account],
  });

  const availableRewards = useContractCall({
    abi: contracts[protocolName].tenderFarm.interface,
    address: addresses[protocolName].tenderFarm,
    method: "availableRewards",
    args: [account],
  });

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
          {!isCorrectChain ? <></> : 
                    <>
                    <Farm protocolName={protocolName} symbol={symbolFull} tokenBalance={lpTokenBalance || "0"} />
                    <Text size="small">{`Balance: ${weiToEthWithDecimals(
                      lpTokenBalance?.toString() || "0",
                      3
                    )} ${symbolFull}`}</Text>
                    </>
          
          }
        </Box>
        <Box direction="column" gap="large" align="center">
          <InfoCard
            title={"Available Rewards"}
            text={`${weiToEthWithDecimals(availableRewards?.toString() || "0", 3)} tender${symbol}`}
            align="center"
          />
          {!isCorrectChain ? <></> : 
            <Unfarm protocolName={protocolName} symbol={symbolFull} stake={stakeOf || "0"} />
          }
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
          {!isCorrectChain ? <></> :
                    <Harvest protocolName={protocolName} symbol={`tender${symbol}`} availableRewards={availableRewards || "0"} />
                  }
        </Box>
      </Box>
      {
          !isCorrectChain && account ? 
        <Box justify="center" align="center" pad={{vertical: "large"}}>
        <SwitchNetwork chainId={requiredChain}/>
        </Box>
        :
        <></>
      }
    </Box>
  );
};

export default TenderFarm;
