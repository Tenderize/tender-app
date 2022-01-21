import { FC } from "react";
import { contracts } from "@tender/contracts";
import { Button } from "grommet";
import { useContractFunction } from "@usedapp/core";
import Dialog from "components/swap/Dialog";

type props = {
  symbol: string;
  name: string;
};

const Faucet: FC<props> = ({ symbol, name }) => {
  const { send } = useContractFunction(contracts[name].faucet, "request");

  // TODO why is this needed
  const requestTokens = () => {
    send();
  };

  return (
    <Dialog
      openButtonLabel="Faucet"
      title="Faucet"
      description={`Get some testnet ${symbol} and ETH (you need ETH to get ${symbol})`}
      button1={<Button primary onClick={requestTokens} label={`Get ${symbol}`} />}
      button2={
        <Button
          primary
          href="https://faucet.metamask.io/"
          target="_blank"
          label="Get ETH"
          style={{ textAlign: "center" }}
        />
      }
    />
  );
};

export default Faucet;
