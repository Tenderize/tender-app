import { FC, MouseEventHandler, useState } from "react";
import { Button, Card, Form, FormControl, InputGroup } from "react-bootstrap";
import { Icon } from "rimble-ui";
import { BigNumber, constants, utils } from "ethers";
import { useContractFunction } from "@usedapp/core";
import { contracts, addresses } from "@tender/contracts";

type Props = {
  protocolName: string;
  tokenSymbol: string;
  tokenBalance: BigNumber;
  tenderBalance: BigNumber;
};

const Swap: FC<Props> = ({ tokenSymbol, tokenBalance, tenderBalance, protocolName }) => {
  const [isSendingToken, setIsSendingToken] = useState(true);
  const [sendTokenAmount, setSendTokenAmount] = useState("0");

  const tenderTokenSymbol = `tender${tokenSymbol}`;
  const tokenSendedSymbol = isSendingToken ? tokenSymbol : tenderTokenSymbol;
  const tokenReceivedSymbol = isSendingToken ? tenderTokenSymbol : tokenSymbol;
  const tokenSendedBalance = isSendingToken ? tokenBalance : tenderBalance;
  const tokenSendedAddress = isSendingToken ? addresses[protocolName].token : addresses[protocolName].tenderToken;
  const tokenReceivedAddress = isSendingToken ? addresses[protocolName].tenderToken : addresses[protocolName].token;

  const { state: swapTx, send: swapExactAmountIn } = useContractFunction(
    contracts[protocolName].swap,
    "swapExactAmountIn"
  );

  const isSendInputInvalid =
    sendTokenAmount === "" || BigNumber.from(utils.parseEther(sendTokenAmount)).gt(tokenSendedBalance);

  const handlePressTrade: MouseEventHandler<HTMLElement> = (e) => {
    e.preventDefault();
    swapExactAmountIn(
      tokenSendedAddress,
      utils.parseEther(sendTokenAmount || "0"),
      tokenReceivedAddress,
      constants.One,
      utils.parseEther("2")
    );
    console.log(swapTx);
  };

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
