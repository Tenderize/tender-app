import { ChangeEventHandler, FC, useCallback, useState } from "react";
import { Button, Box, Form, FormField, TextInput, Text } from "grommet";
import { BigNumberish, utils, BigNumber, constants } from "ethers";
import { useContractCall } from "@usedapp/core";
import { contracts, addresses } from "@tender/contracts";

import ApproveToken from "../approve/ApproveToken";
import ConfirmSwapModal from "./ConfirmSwapModal";
import { useIsTokenApproved } from "../approve/useIsTokenApproved";
import { Transaction } from "grommet-icons";
import { weiToEthWithDecimals } from "../../utils/amountFormat";

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

  const tenderTokenSymbol = `t${tokenSymbol}`;
  const tokenSendedSymbol = isSendingToken ? tokenSymbol : tenderTokenSymbol;
  const tokenReceivedSymbol = isSendingToken ? tenderTokenSymbol : tokenSymbol;
  const tokenSendedBalance = isSendingToken ? tokenBalance : tenderTokenBalance;
  const tokenReceivedBalance = isSendingToken ? tenderTokenBalance : tokenBalance;
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

  const isSendInputInvalid =
    sendTokenAmount === "" || BigNumber.from(utils.parseEther(sendTokenAmount)).gt(tokenSendedBalance);

  return (
    <Box>
      <Form>
        <Box align="center" justify="center">
          <Box direction="row" gap="small">
            <FormField
              label={`Send ${tokenSendedSymbol}`}
              validate={{ function: () => isSendInputInvalid, message: "Please provide an available amount" }}
            >
              <Box width="medium">
                <TextInput
                  id="formSwapSend"
                  type="number"
                  value={sendTokenAmount}
                  onChange={handleSendTokenInput}
                  required={true}
                />
                <Box direction="row" gap="small">
                  <Text>{`Balance: ${weiToEthWithDecimals(tokenSendedBalance, 4)} ${tokenSendedSymbol}`}</Text>
                  <Button
                    plain
                    onClick={() => setSendTokenAmount(utils.formatEther(tokenSendedBalance.toString() ?? "0"))}
                  >
                    <Text color="brand">(Max)</Text>
                  </Button>
                </Box>
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
              hasAllowance={isTokenApproved}
            />
            <Button
              primary
              disabled={!isTokenApproved || isSendInputInvalid || utils.parseEther(sendTokenAmount).eq(constants.Zero)}
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
