import { ChangeEventHandler, FC, useCallback, useState } from "react";
import { Button, Card, Form, FormControl, InputGroup } from "react-bootstrap";
import { Icon } from "rimble-ui";
import { BigNumberish, utils, BigNumber, constants } from "ethers";
import { useContractCall, useTokenAllowance, useEthers } from "@usedapp/core";
import { contracts, addresses } from "@tender/contracts";

import ApproveToken from "../approve/ApproveToken";
import ConfirmSwapModal from "./ConfirmSwapModal";

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
  const [showConfirm, setShowConfirm] = useState(false);
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
  const tokenSpotPrice = (
    isSendingToken ? ONE.mul(ONE).div(hasValue(spotPrice) ? spotPrice : ONE) : BigNumber.from(spotPrice.toString())
  )
    .mul(11)
    .div(10);

  const { account } = useEthers();

  const allowance = useTokenAllowance(tokenSendedAddress, account, addresses[protocolName].swap);
  const isTokenApproved = allowance != null && allowance.gte(sendTokenAmount === "" ? "0" : sendTokenAmount);

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

  const isSendInputInvalid =
    sendTokenAmount === "" || BigNumber.from(utils.parseEther(sendTokenAmount)).gt(tokenSendedBalance);

  return (
    <Card>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Swap</Form.Label>
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
              <FormControl id="formSwapReceive" placeholder={"0"} value={utils.formatEther(calcOutGivenIn || "0")} />
            </InputGroup>
          </Form.Group>
          <div className="d-grid gap-2">
            <ApproveToken
              symbol={tokenSendedSymbol}
              spender={addresses[protocolName].swap}
              tokenAddress={isSendingToken ? contracts[protocolName].token : contracts[protocolName].tenderToken}
              hasAllowance={isTokenApproved}
            />
            <Button
              disabled={!isTokenApproved || isSendInputInvalid || utils.parseEther(sendTokenAmount).eq(constants.Zero)}
              onClick={() => setShowConfirm(true)}
            >
              Trade
            </Button>
          </div>
        </Form>
      </Card.Body>
      <ConfirmSwapModal
        show={showConfirm}
        onDismiss={() => setShowConfirm(false)}
        tokenSendedSymbol={tokenSendedSymbol}
        sendTokenAmount={sendTokenAmount}
        tokenReceivedSymbol={tokenReceivedSymbol}
        receiveTokenAmount={calcOutGivenIn}
        tokenSpotPrice={tokenSpotPrice}
        tokenSendedAddress={tokenSendedAddress}
        tokenReceivedAddress={tokenReceivedAddress}
        protocolName={protocolName}
      />
    </Card>
  );
};

export default Swap;
