import { FC, useState } from "react";
import { Button, Card, Form, FormControl, InputGroup } from "react-bootstrap";
import { Icon } from "rimble-ui";
import { BigNumber, utils } from "ethers";

type Props = {
  tokenSymbol: string;
  tokenBalance: BigNumber;
  tenderBalance: BigNumber;
};

const Swap: FC<Props> = ({ tokenSymbol, tokenBalance, tenderBalance }) => {
  const [isSendingToken, setIsSendingToken] = useState(true);
  const tenderTokenSymbol = `tender${tokenSymbol}`;

  const tokenSendedSymbol = isSendingToken ? tokenSymbol : tenderTokenSymbol;
  const tokenReceivedSymbol = isSendingToken ? tenderTokenSymbol : tokenSymbol;
  const tokenSendedBalance = isSendingToken ? tokenBalance : tenderBalance;

  const [sendTokenAmount, setSendTokenAmount] = useState("0");

  return (
    <Card>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formSwapSend">
            <Form.Label>Send</Form.Label>
            <InputGroup className="mb-2">
              <InputGroup.Text>{tokenSendedSymbol}</InputGroup.Text>
              <FormControl id="formSwapSend" value={sendTokenAmount} />
              <InputGroup.Append>
                <Button
                  variant="secondary"
                  onClick={() => setSendTokenAmount(utils.formatEther(tokenSendedBalance.toString() ?? "0"))}
                >
                  Max
                </Button>
              </InputGroup.Append>
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

          <Button>Trade</Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Swap;
