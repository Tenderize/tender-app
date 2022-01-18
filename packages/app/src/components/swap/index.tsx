import { FC } from "react";
import { BigNumber, BigNumberish } from "ethers";
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
  lpTokenBalance: BigNumber;
};

const LiquidityPool: FC<Props> = ({ name, symbol, tokenBalance, tenderTokenBalance, lpTokenBalance }) => {
  return (
    <Box justify="start" align="center">
      <Swap
        protocolName={name}
        tokenSymbol={symbol}
        tokenBalance={tokenBalance}
        tenderTokenBalance={tenderTokenBalance}
      />
      <Box
        border={{ side: "top" }}
        direction="column"
        justify="center"
        align="center"
        pad={{ horizontal: "large", top: "medium" }}
        width="large"
        margin={{ top: "large" }}
      >
        <Text>Provide Liquidity</Text>
        <Box direction="row" gap="large" justify="center" align="center">
          <JoinPool name={name} symbol={symbol} tokenBalance={tokenBalance} tenderTokenBalance={tenderTokenBalance} />
          <ExitPool name={name} symbol={symbol} lpTokenBalance={lpTokenBalance} />
        </Box>
      </Box>
    </Box>
  );
};

export default LiquidityPool;
