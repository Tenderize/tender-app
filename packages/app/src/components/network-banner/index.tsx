import { ChainId, useEthers } from "@usedapp/core";
import { SwitchNetwork } from "components/account/SwitchNetwork";
import { Box, Text } from "grommet";
import { FC } from "react";

const NetworkBanner: FC = () => {
  const { chainId } = useEthers();

  if (chainId === ChainId.Rinkeby || chainId === ChainId.ArbitrumRinkeby) {
    return null;
  }

  const message = "to use Tenderize.me";

  return (
    <Box background="#FFE8B9" height="40px" justify="center" align="center" gap="xsmall" direction="row">
      <SwitchNetwork chainId={chainId} />
      <Text color="gray" size="small">
        {message}
      </Text>
    </Box>
  );
};

export default NetworkBanner;