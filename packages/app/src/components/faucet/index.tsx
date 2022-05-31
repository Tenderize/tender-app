import { FC } from "react";
import { contracts } from "@tender/contracts/src/index";
import { Button } from "grommet";
import { ChainId, useContractFunction, useEtherBalance, useEthers } from "@usedapp/core";
import Dialog from "components/swap/Dialog";
import { LoadingButtonContent } from "components/LoadingButtonContent";
import { isPendingTransaction } from "../../utils/transactions";
import { stakers } from "@tender/shared/src/index";
import { constants } from "ethers";
import { ProtocolName } from "@tender/shared/src/data/stakers";

const Faucet: FC<{
  symbol: string;
  protocolName: ProtocolName;
}> = ({ symbol, protocolName }) => {
  const { state: requestTx, send: request } = useContractFunction(contracts[protocolName].faucet, "request", {
    transactionName: `Requesting ${symbol} from faucet`,
  });

  const { account } = useEthers();
  const balance = useEtherBalance(account);

  // TODO why is this needed
  const requestTokens = () => {
    request();
  };
  const isRinkebyArbitrum = stakers[protocolName].chainId === ChainId.ArbitrumRinkeby;

  return (
    <Dialog
      card={{ width: "large" }}
      width="large"
      openButtonLabel="Faucet"
      title="Faucet"
      description={`Get some testnet ETH first, then some ${symbol}.
${isRinkebyArbitrum ? "To get ETH on ArbitrumRinkeby, you have to bridge it from Rinkeby." : ""}
          `}
      buttons={[
        <Button
          primary
          style={{ width: "100%" }}
          href="https://www.rinkebyfaucet.com/"
          target="_blank"
          label="Get ETH"
        />,
        isRinkebyArbitrum && (
          <Button
            primary
            style={{ width: "100%" }}
            href="https://bridge.arbitrum.io/"
            target="_blank"
            label="Bridge ETH"
          />
        ),
        <Button
          primary
          style={{ width: "100%" }}
          onClick={requestTokens}
          label={
            isPendingTransaction(requestTx) ? <LoadingButtonContent label={`Request ${symbol}`} /> : `Get ${symbol}`
          }
          disabled={balance?.eq(constants.Zero) || isPendingTransaction(requestTx)}
        />,
      ]}
    />
  );
};

export default Faucet;
