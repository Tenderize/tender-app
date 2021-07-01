import { FC } from "react";
import { BigNumber, BigNumberish, utils } from "ethers";
import { useContractCall, useContractCalls } from "@usedapp/core";
import { addresses, contracts } from "@tender/contracts";

import Swap from "./swap";
import JoinPool from "./join";

type Props = {
  name: string;
  symbol: string;
  account: string;
  tokenBalance: BigNumberish;
  tenderTokenBalance: BigNumberish;
};

const LiquidityPool: FC<Props> = ({ name, symbol, account, tokenBalance, tenderTokenBalance }) => {
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
  ]);

  return (
    <>
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
      />
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
    </>
  );
};

export default LiquidityPool;
