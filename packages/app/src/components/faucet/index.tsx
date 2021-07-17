import { FC } from "react";
import { useContractFunction } from "@usedapp/core";
import { Button, Card } from "react-bootstrap";
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
      <Card.Body className="d-grid gap-2">
        <h3>Faucet</h3>
        {`Get some testnet ${symbol} and ETH (you need ETH to get LPT)`}
        <Button variant="info" onClick={requestTokens}>{`Get ${symbol}`}</Button>
        <a className="btn btn-info" href="https://faucet.metamask.io/" target="_blank" rel="noreferrer">
          Get ETH
        </a>
      </Card.Body>
    </Card>
  );
};

export default Faucet;
