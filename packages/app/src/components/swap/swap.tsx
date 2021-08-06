import { ChangeEventHandler, FC, useCallback, useState } from "react";
import { Button, Box, Form, FormField, TextInput } from "grommet";
import { BigNumberish, utils, BigNumber } from "ethers";
import { useContractCall } from "@usedapp/core";
import { contracts, addresses } from "@tender/contracts";

import ApproveToken from "../approve/ApproveToken";
import ConfirmSwapModal from "./ConfirmSwapModal";
import { useIsTokenApproved } from "../approve/useIsTokenApproved";
import { Transaction } from "grommet-icons";
import { weiToEthWithDecimals } from "../../utils/amountFormat";
import { AmountInputFooter } from "../AmountInputFooter";
import { isPositiveAndSmallerThanMax } from "../../utils/inputValidation";

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
  const [sendTokenAmount, setSendTokenAmount] = useState("");

  const tenderTokenSymbol = `t${tokenSymbol}`;
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

  const isTokenApproved = useIsTokenApproved(tokenSendedAddress, addresses[protocolName].swap, sendTokenAmount);

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

  const isSendInputInvalid = isPositiveAndSmallerThanMax(sendTokenAmount, tokenSendedBalance);

  return (
    <Box>
      <Form validate="change">
        <Box align="center" justify="center">
          <Box direction="row" gap="small">
            <FormField
              name="sendAmount"
              label={`Send ${tokenSendedSymbol}`}
              validate={() => {
                if (isSendInputInvalid) {
                  return { message: "Please provide an available amount", status: "error" };
                }
                return undefined;
              }}
            >
              <Box width="medium">
                <TextInput
                  id="formSwapSend"
                  type="number"
                  value={sendTokenAmount}
                  placeholder={`0 ${tokenSendedSymbol}`}
                  onChange={handleSendTokenInput}
                  required={true}
                />
                <AmountInputFooter
                  label={`Balance: ${weiToEthWithDecimals(tokenSendedBalance, 4)} ${tokenSendedSymbol}`}
                  onClick={() => setSendTokenAmount(utils.formatEther(tokenSendedBalance.toString() ?? "0"))}
                />
              </Box>
            </FormField>
            <Button
              plain
              color="none"
              icon={<Transaction color="white" />}
              onClick={() => setIsSendingToken(!isSendingToken)}
            />
            <FormField label={`Receive ${tokenReceivedSymbol}`} readOnly>
              <Box width="medium">
                <TextInput
                  readOnly
                  id="formSwapReceive"
                  placeholder={"0"}
                  value={utils.formatEther(calcOutGivenIn || "0")}
                />
              </Box>
            </FormField>
          </Box>
          <Box width="large" direction="column" pad={{ horizontal: "large" }} gap="small">
            <ApproveToken
              symbol={tokenSendedSymbol}
              spender={addresses[protocolName].swap}
              token={isSendingToken ? contracts[protocolName].token : contracts[protocolName].tenderToken}
              show={!isTokenApproved}
            />
            <Button
              primary
              disabled={!isTokenApproved || isSendInputInvalid || utils.parseEther(sendTokenAmount).isZero()}
              onClick={() => setShowConfirm(true)}
              label="Trade"
            />
          </Box>
        </Box>
      </Form>
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
    </Box>
  );
};

export default Swap;
