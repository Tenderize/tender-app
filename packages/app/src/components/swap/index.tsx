import { FC } from "react";
import { BigNumberish } from "ethers";
import { useContractCalls } from "@usedapp/core";
import { addresses, contracts } from "@tender/contracts";

import Swap from "./swap";
import JoinPool from "./join";
import ExitPool from "./exit";
import { Box, Text } from "grommet";

type Props = {
  name: string;
  symbol: string;
  tokenBalance: BigNumberish;
  tenderTokenBalance: BigNumberish;
  lpTokenBalance: BigNumberish;
};

const LiquidityPool: FC<Props> = ({ name, symbol, tokenBalance, tenderTokenBalance, lpTokenBalance }) => {
  // Swap fee
  // Total weight
  // Token Weight
  // TenderToken Weight
  const [
    swapFee,
    totalDenormWeight,
    tokenDenormWeight,
    tenderTokenDenormWeight,
    tokenLpBalance,
    tenderLpBalance,
    lpShares,
    spotPrice,
  ] = useContractCalls([
    {
      abi: contracts[name].swap.interface,
      address: addresses[name].swap,
      method: "getSwapFee",
      args: [],
    },
    {
      abi: contracts[name].swap.interface,
      address: addresses[name].swap,
      method: "getTotalDenormalizedWeight",
      args: [],
    },
    {
      abi: contracts[name].swap.interface,
      address: addresses[name].swap,
      method: "getDenormalizedWeight",
      args: [addresses[name].token],
    },
    {
      abi: contracts[name].swap.interface,
      address: addresses[name].swap,
      method: "getDenormalizedWeight",
      args: [addresses[name].tenderToken],
    },
    {
      abi: contracts[name].swap.interface,
      address: addresses[name].swap,
      method: "getBalance",
      args: [addresses[name].token],
    },
    {
      abi: contracts[name].swap.interface,
      address: addresses[name].swap,
      method: "getBalance",
      args: [addresses[name].tenderToken],
    },
    {
      abi: contracts[name].swap.interface,
      address: addresses[name].liquidity,
      method: "totalSupply",
      args: [],
    },
    {
      abi: contracts[name].swap.interface,
      address: addresses[name].swap,
      method: "getSpotPrice",
      args: [addresses[name].tenderToken, addresses[name].token],
    },
  ]);

  return (
    <Box justify="start" align="center">
      <Swap
        protocolName={name}
        tokenSymbol={symbol}
        tokenBalance={tokenBalance}
        tenderTokenBalance={tenderTokenBalance}
        tokenWeight={tokenDenormWeight ? tokenDenormWeight[0] : "0"}
        tenderTokenWeight={tenderTokenDenormWeight ? tenderTokenDenormWeight[0] : "0"}
        totalWeight={totalDenormWeight ? totalDenormWeight[0] : "0"}
        swapFee={swapFee ? swapFee[0] : "0"}
        tokenLpBalance={tokenLpBalance ? tokenLpBalance[0] : "0"}
        tenderLpBalance={tenderLpBalance ? tenderLpBalance[0] : "0"}
        spotPrice={spotPrice ? spotPrice[0] : "0"}
      />
      <Box border={{side: "top"}} direction="column" justify="center" align="center" pad={{horizontal: "large", top:"medium"}} width="large" margin={{top: "large"}}>
        <Text>Provide Liquidity</Text>
      <Box direction="row" gap="large" justify="center" align="center">
      <JoinPool
        name={name}
        symbol={symbol}
        tokenBalance={tokenBalance}
        tenderTokenBalance={tenderTokenBalance}
        tokenWeight={tokenDenormWeight ? tokenDenormWeight[0] : "0"}
        tenderTokenWeight={tenderTokenDenormWeight ? tenderTokenDenormWeight[0] : "0"}
        totalWeight={totalDenormWeight ? totalDenormWeight[0] : "0"}
        swapFee={swapFee ? swapFee[0] : "0"}
        tokenLpBalance={tokenLpBalance ? tokenLpBalance[0] : "0"}
        tenderLpBalance={tenderLpBalance ? tenderLpBalance[0] : "0"}
        lpShares={lpShares ? lpShares[0] : "0"}
      />
      <ExitPool
        name={name}
        symbol={symbol}
        tokenWeight={tokenDenormWeight ? tokenDenormWeight[0] : "0"}
        tenderTokenWeight={tenderTokenDenormWeight ? tenderTokenDenormWeight[0] : "0"}
        totalWeight={totalDenormWeight ? totalDenormWeight[0] : "0"}
        swapFee={swapFee ? swapFee[0] : "0"}
        tokenLpBalance={tokenLpBalance ? tokenLpBalance[0] : "0"}
        tenderLpBalance={tenderLpBalance ? tenderLpBalance[0] : "0"}
        lpShares={lpShares ? lpShares[0] : "0"}
        lpTokenBalance={lpTokenBalance}
      />
      </Box>
      </Box>
    </Box>
  );
};

export default LiquidityPool;
