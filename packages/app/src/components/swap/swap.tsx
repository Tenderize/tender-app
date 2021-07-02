import { ChangeEventHandler, FC, MouseEventHandler, useCallback, useEffect, useState } from "react";
import { Alert, Button, Card, Form, FormControl, InputGroup, Tooltip, OverlayTrigger } from "react-bootstrap";
import { Icon } from "rimble-ui";
import { BigNumberish, utils, BigNumber, constants } from "ethers";
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
  spotPrice: BigNumberish;
};

const hasValue = (val: any) => {
  return val && val !== "0";
};

const ONE = utils.parseEther("1");

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
  spotPrice,
}) => {
  const [showAlert, setShowAlert] = useState(true);
  const [isSendingToken, setIsSendingToken] = useState(true);
  const [sendTokenAmount, setSendTokenAmount] = useState("0");
  const [receiveTokenAmount, setReceiveTokenAmount] = useState<BigNumber | "0">("0");

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
  const tokenSpotPrice = (
    isSendingToken ? ONE.mul(ONE).div(hasValue(spotPrice) ? spotPrice : ONE) : BigNumber.from(spotPrice.toString())
  )
    .mul(11)
    .div(10);

  const { state: _swapTx, send: swapExactAmountIn } = useContractFunction(
    contracts[protocolName].swap,
    "swapExactAmountIn"
  );

  const { state: _approveTokenTx, send: approveUnderlyingTokens } = useContractFunction(
    contracts[protocolName].token,
    "approve"
  );

  const { state: _approveTenderTx, send: approveTenderTokens } = useContractFunction(
    contracts[protocolName].tenderToken,
    "approve"
  );

  const [calcOutGivenIn] =
    useContractCall(
      hasValue(tokenSendedLpBalance) &&
        hasValue(tokenSendedWeight) &&
        hasValue(tokenReceivedLpBalance) &&
        hasValue(tokenReceivedWeight) &&
        hasValue(sendTokenAmount) &&
        hasValue(swapFee) && {
          abi: contracts[protocolName].swap.interface,
          address: addresses[protocolName].swap,
          method: "calcOutGivenIn",
          args: [
            tokenSendedLpBalance || "0",
            tokenSendedWeight || "0",
            tokenReceivedLpBalance || "0",
            tokenReceivedWeight || utils.parseEther("1"),
            utils.parseEther(sendTokenAmount || "0"),
            swapFee || "0",
          ],
        }
    ) ?? [];

  const handleSendTokenInput: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setSendTokenAmount(e.target.value);
  }, []);

  useEffect(() => {
    if (calcOutGivenIn != null && !calcOutGivenIn.eq(receiveTokenAmount)) {
      setReceiveTokenAmount(calcOutGivenIn);
    } else if (calcOutGivenIn == null) {
      setReceiveTokenAmount("0");
    }
  }, [calcOutGivenIn, receiveTokenAmount]);

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
    swapExactAmountIn(tokenSendedAddress, amount, tokenReceivedAddress, calcOutGivenIn, tokenSpotPrice);
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
                onChange={handleSendTokenInput}
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

          <Form.Group className="mb-3">
            <Form.Label>Receive</Form.Label>
            <InputGroup className="mb-2">
              <InputGroup.Text>{tokenReceivedSymbol}</InputGroup.Text>
              <FormControl
                id="formSwapReceive"
                placeholder={"0"}
                value={utils.formatEther(receiveTokenAmount || "0")}
              />
            </InputGroup>
          </Form.Group>
          <Alert
            style={{ display: "flex", justifyContent: "space-between", cursor: "pointer" }}
            onClick={() => setShowAlert(!showAlert)}
            show={showAlert}
            variant={"primary"}
          >
            Allow the Tenderize Protocol to use your {tokenSendedSymbol}
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip id="button-tooltip-2">
                  You must give the Tenderize smart contracts permission to use your {tokenSendedSymbol}. You only have
                  to do this once per token.
                </Tooltip>
              }
            >
              {({ ref, ...triggerHandler }) => (
                <Alert.Link ref={ref} {...triggerHandler} className="d-inline-flex align-items-center">
                  <span className="ms-1"> &#8505;</span>
                </Alert.Link>
              )}
            </OverlayTrigger>
          </Alert>
          <Button disabled={isSendInputInvalid} onClick={handlePressTrade}>
            Trade
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Swap;
