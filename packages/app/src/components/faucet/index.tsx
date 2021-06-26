import { FC } from "react";
import { Card, Button, Text } from "rimble-ui";
import { useContractFunction } from "@usedapp/core";

import { contracts } from "@tender/contracts";

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
    <Card>
      <Text required="">{`Get some testnet ${symbol} and ETH (you need ETH to get LPT)`}</Text>
      <Button onClick={requestTokens}>{`Get ${symbol}`}</Button>
      <a href="https://faucet.metamask.io/" target="_blank" rel="noreferrer">
        <Button>Get Eth</Button>
      </a>
    </Card>
  );
};

export default Faucet;
