import { FC } from "react";
import { BigNumber, BigNumberish } from "ethers";
import { useEthers } from "@usedapp/core";

import Swap from "./swap";
import JoinPool from "./join";
import ExitPool from "./exit";
import { Box, Text } from "grommet";
import { useIsCorrectChain } from "utils/useEnsureRinkebyConnect";
import { SwitchNetwork } from "components/account/SwitchNetwork";
import stakers from "data/stakers";

type Props = {
  protocolName: string;
  symbol: string;
  tokenBalance: BigNumberish;
  tenderTokenBalance: BigNumberish;
  lpTokenBalance: BigNumber;
};

const LiquidityPool: FC<Props> = ({ protocolName, symbol, tokenBalance, tenderTokenBalance, lpTokenBalance }) => {
  const requiredChain = stakers[protocolName].chainId;
  const { account } = useEthers();
  const isCorrectChain = useIsCorrectChain(requiredChain);

  return (
    <Box justify="center" align="center" direction="column">
      <Swap
        protocolName={protocolName}
        tokenSymbol={symbol}
        tokenBalance={tokenBalance}
        tenderTokenBalance={tenderTokenBalance}
        disabled={!isCorrectChain}
      />
      {!isCorrectChain && account ? (
        <Box pad={{ vertical: "large" }}>
          <SwitchNetwork chainId={requiredChain} />
        </Box>
      ) : (
        <Box
          margin={{ top: "medium" }}
          pad={{ horizontal: "large", vertical: "medium" }}
          border={{ side: "top" }}
          justify="center"
          align="center"
          direction="column"
          gap="small"
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
      )}
    </Box>
  );
};

export default LiquidityPool;
