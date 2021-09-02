import { ChainId, useEthers } from "@usedapp/core";
import { Box, Text } from "grommet";
import { FC } from "react";

const TestnetBanner: FC = () => {
  const { chainId } = useEthers();

  if (chainId === ChainId.Rinkeby) {
    return null;
  }

  const message = chainId === undefined ? "Please connect your Wallet" : "Please switch to Rinkeby to use Tenderize.me";

  return (
    <Box background="#FFE8B9" height="40px" align="center" justify="around">
      <Text color="gray" size="small">
        {message}
      </Text>
    </Box>
  );
};

export default TestnetBanner;
