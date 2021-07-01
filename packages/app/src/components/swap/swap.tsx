import { FC, MouseEventHandler, useState } from "react";
import { Button, Card, Form, FormControl, InputGroup } from "react-bootstrap";
import { Icon } from "rimble-ui";
import { BigNumberish, utils, BigNumber } from "ethers";
import { useContractFunction, useContractCall } from "@usedapp/core";
import { contracts, addresses } from "@tender/contracts";

type Props = {
  protocolName: string;
  tokenSymbol: string;
  tokenBalance: BigNumberish;
  tenderTokenBalance: BigNumberish;

  swapFee: BigNumberish;
  tokenLpBalance: BigNumberish;
  tokenWeight: BigNumberish;
  tenderLpBalance: BigNumberish;
  tenderTokenWeight: BigNumberish;
  totalWeight: BigNumberish;
};

const Swap: FC<Props> = ({
  tokenSymbol,
  tokenBalance,
  tenderTokenBalance,
  protocolName,
  swapFee,
  tokenLpBalance,
  tokenWeight,
  tenderLpBalance,
  tenderTokenWeight,
  totalWeight,
}) => {
  const [isSendingToken, setIsSendingToken] = useState(true);
  const [sendTokenAmount, setSendTokenAmount] = useState("0");

  const tenderTokenSymbol = `tender${tokenSymbol}`;
  const tokenSendedSymbol = isSendingToken ? tokenSymbol : tenderTokenSymbol;
  const tokenReceivedSymbol = isSendingToken ? tenderTokenSymbol : tokenSymbol;
  const tokenSendedBalance = isSendingToken ? tokenBalance : tenderTokenBalance;
  const tokenSendedLpBalance = isSendingToken ? tokenLpBalance : tenderLpBalance;
  const tokenSendedWeight = isSendingToken ? tokenWeight : tenderTokenWeight;
  const tokenSendedAddress = isSendingToken ? addresses[protocolName].token : addresses[protocolName].tenderToken;
  const tokenReceivedAddress = isSendingToken ? addresses[protocolName].tenderToken : addresses[protocolName].token;
  const tokenReceivedLpBalance = isSendingToken ? tenderLpBalance : tokenLpBalance;
  const tokenReceivedWeight = isSendingToken ? tenderTokenWeight : tokenWeight;
  const { state: swapTx, send: swapExactAmountIn } = useContractFunction(
    contracts[protocolName].swap,
    "swapExactAmountIn"
  );

  const { state: approveTokenTx, send: approveUnderlyingTokens } = useContractFunction(
    contracts[protocolName].token,
    "approve"
  );

  const { state: approveTenderTx, send: approveTenderTokens } = useContractFunction(
    contracts[protocolName].tenderToken,
    "approve"
  );

  // const calcOutGivenIn = useContractCall({
  //   abi: contracts[protocolName].swap.interface,
  //   address: addresses[protocolName].swap,
  //   method: "calcOutGivenIn",
  //   args: [
  //     tokenSendedLpBalance || "0",
  //     tokenSendedWeight || "0",
  //     tokenReceivedLpBalance || "0",
  //     tokenReceivedWeight || utils.parseEther("1"),
  //     utils.parseEther(sendTokenAmount || "0"),
  //     swapFee || "0",
  //   ],
  // });

  // console.log(utils.formatEther(calcOutGivenIn || "0"));

  const isSendInputInvalid =
    sendTokenAmount === "" || BigNumber.from(utils.parseEther(sendTokenAmount)).gt(tokenSendedBalance);

  const handlePressTrade: MouseEventHandler<HTMLElement> = async (e) => {
    e.preventDefault();

    const amount = utils.parseEther(sendTokenAmount || "0");
    if (isSendingToken) {
      await approveUnderlyingTokens(addresses[protocolName].swap, amount);
    } else {
      await approveTenderTokens(addresses[protocolName].swap, amount);
    }

    swapExactAmountIn(tokenSendedAddress, amount, tokenReceivedAddress, utils.parseEther("0.1"), utils.parseEther("2"));
    console.log(swapTx);
  };

  console.log("XXX", approveTokenTx);

  return (
    <Card>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Send</Form.Label>
            <InputGroup className="mb-2" hasValidation={true}>
              <InputGroup.Text>{tokenSendedSymbol}</InputGroup.Text>
              <Form.Control
                id="formSwapSend"
                type="number"
                value={sendTokenAmount}
                onChange={(e) => setSendTokenAmount(e.target.value)}
                required={true}
                isInvalid={isSendInputInvalid}
              />
              <InputGroup.Append>
                <Button
                  variant="secondary"
                  onClick={() => setSendTokenAmount(utils.formatEther(tokenSendedBalance.toString() ?? "0"))}
                >
                  Max
                </Button>
              </InputGroup.Append>
              <Form.Control.Feedback type="invalid">Please provide an available amount.</Form.Control.Feedback>
            </InputGroup>
            <Form.Text id="fromSwapSendBalance" muted>
              {`Current Balance: ${utils.formatEther(tokenSendedBalance.toString() ?? "0")} ${tokenSendedSymbol}`}
            </Form.Text>
          </Form.Group>

          <Button onClick={() => setIsSendingToken(!isSendingToken)}>
            <Icon name="SwapVert" color="white" aria-label="Switch" />
          </Button>

          <Form.Group className="mb-3" controlId="formSwapReceive">
            <Form.Label>Receive</Form.Label>
            <InputGroup className="mb-2">
              <InputGroup.Text>{tokenReceivedSymbol}</InputGroup.Text>
              <FormControl id="formSwapReceive" placeholder="0" />
            </InputGroup>
          </Form.Group>

          <Button disabled={isSendInputInvalid} onClick={handlePressTrade}>
            Trade
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Swap;
