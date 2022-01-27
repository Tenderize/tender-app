import { FC } from "react";
import { contracts } from "@tender/contracts";
import { Button } from "grommet";
import { useContractFunction } from "@usedapp/core";
import Dialog from "components/swap/Dialog";
import { LoadingButtonContent } from "components/LoadingButtonContent";
import { isPendingTransaction } from "../../utils/transactions";
type props = {
  symbol: string;
  name: string;
};

const Faucet: FC<props> = ({ symbol, name }) => {
  const { state: requestTx, send: request } = useContractFunction(contracts[name].faucet, "request", {
    transactionName: `Requesting ${symbol} from faucet`,
  });

  // TODO why is this needed
  const requestTokens = () => {
    request();
  };

  return (
    <Dialog
      card={{ width: "large" }}
      width="large"
      openButtonLabel="Faucet"
      title="Faucet"
      description={`Get some testnet ${symbol} and ETH (you need ETH to get ${symbol})`}
      button1={
        <Button
          primary
          style={{ width: "100%" }}
          onClick={requestTokens}
          label={
            isPendingTransaction(requestTx) ? <LoadingButtonContent label={`Request ${symbol}`} /> : `Get ${symbol}`
          }
          disabled={isPendingTransaction(requestTx)}
        />
      }
      button2={
        <Button
          primary
          style={{ width: "100%" }}
          href="https://www.rinkebyfaucet.com/"
          target="_blank"
          label="Get ETH"
        />
      }
    />
  );
};

export default Faucet;
