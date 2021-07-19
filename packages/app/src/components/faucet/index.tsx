import { FC } from "react";
import { Link } from "react-router-dom";
import { useContractFunction } from "@usedapp/core";
import { contracts } from "@tender/contracts";
import {Box, Button, Text, Heading} from "grommet" 
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
    <Box>
      <Heading>{symbol} Faucet</Heading>
      <Text>
      {`Get some testnet ${symbol} and ETH (you need ETH to get LPT)`}
      </Text>
      <Button primary onClick={requestTokens}>{`Get ${symbol}`}</Button>
      <Link url="https://faucet.metamask.io/" target="_blank" rel="noreferrer">Get ETH</Link>
    </Box>
  );
};

export default Faucet;
