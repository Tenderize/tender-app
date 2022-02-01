import { FC } from "react";
import { BigNumber, BigNumberish } from "ethers";

import Swap from "./swap";
import JoinPool from "./join";
import ExitPool from "./exit";
import { Box, Text } from "grommet";

type Props = {
  protocolName: string;
  symbol: string;
  tokenBalance: BigNumberish;
  tenderTokenBalance: BigNumberish;
  lpTokenBalance: BigNumber;
};

const LiquidityPool: FC<Props> = ({ protocolName, symbol, tokenBalance, tenderTokenBalance, lpTokenBalance }) => {
  return (
    <Box justify="start" align="center">
      <Swap
        protocolName={protocolName}
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
          <JoinPool
            protocolName={protocolName}
            symbol={symbol}
            tokenBalance={tokenBalance}
            tenderTokenBalance={tenderTokenBalance}
          />
          <ExitPool protocolName={protocolName} symbol={symbol} lpTokenBalance={lpTokenBalance} />
        </Box>
      </Box>
    </Box>
  );
};

export default LiquidityPool;
