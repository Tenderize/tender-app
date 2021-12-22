import { ChainId, useEthers } from "@usedapp/core";
import { SwitchNetwork } from "components/account/SwitchNetwork";
import { Box, Text } from "grommet";
import { FC } from "react";

const TestnetBanner: FC = () => {
  const { chainId } = useEthers();

  if (chainId === ChainId.Rinkeby) {
    return null;
  }

  const message = "Please switch to Rinkeby to use Tenderize.me";

  return (
    <Box background="#FFE8B9" height="40px" justify="center" align="center" gap="small" direction="row">
      <Text color="gray" size="small">
        {message}
      </Text>
      <SwitchNetwork />
    </Box>
  );
};

export default TestnetBanner;
