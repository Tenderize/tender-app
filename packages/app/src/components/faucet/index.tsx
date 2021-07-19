import { FC } from "react";
import { Link } from "react-router-dom";
import { useContractFunction } from "@usedapp/core";
import { contracts } from "@tender/contracts";
import { Box, Button, Text, Heading } from "grommet";
type Props = {
  symbol: string;
  name: string;
};

const Faucet: FC<Props> = ({ symbol, name }) => {
  const { state, send } = useContractFunction(contracts[name].faucet, "request");

  const requestTokens = () => {
    send();
    console.log(state.status);
  };
  return (
    <Box pad={{ horizontal: "large" }} gap="small">
      <Heading>{symbol} Faucet</Heading>
      <Text>{`Get some testnet ${symbol} and ETH (you need ETH to get LPT)`}</Text>
      <Button primary onClick={requestTokens} label={`Get ${symbol}`} />
      <Button primary href="https://faucet.metamask.io/" target="_blank" label="Get ETH" />
    </Box>
  );
};

export default Faucet;
