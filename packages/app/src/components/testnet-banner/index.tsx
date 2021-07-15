import { Box, Text } from "grommet";
import { FC } from "react";

const TestnetBanner: FC = () => {
  return (
    <Box background="#FFE8B9" style={{ height: 40 }} align="center" justify="around">
      <Text color="gray" size="small">
        Tenderize.me is currently only live on Rinkeby testnet.
      </Text>
    </Box>
  );
};

export default TestnetBanner;
