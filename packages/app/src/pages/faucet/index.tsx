import { FC } from "react";
import { useContractFunction } from "@usedapp/core";
import { contracts } from "@tender/contracts";
import { Box, Button, Text, Heading } from "grommet";

const Faucet: FC = () => {
  const { state, send } = useContractFunction(contracts.livepeer.faucet, "request");

  const requestTokens = () => {
    send();
    console.log(state.status);
  };
  return (
    <Box align="center">
      <Box width="large" gap="small">
        <Heading>LPT Faucet</Heading>
        <Text>{`Get some testnet LPT and ETH (you need ETH to get LPT)`}</Text>
        <Button primary onClick={requestTokens} label={`Get LPT`} />
        <Button primary href="https://faucet.metamask.io/" target="_blank" label="Get ETH" />
      </Box>
    </Box>
  );
};

export default Faucet;
