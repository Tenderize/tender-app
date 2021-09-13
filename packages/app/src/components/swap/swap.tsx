import { ChangeEventHandler, FC, useCallback, useEffect, useState } from "react";
import { Button, Box, Form, FormField, Image, Text, TextInput } from "grommet";
import { BigNumberish, utils, BigNumber } from "ethers";
import { useContractCall } from "@usedapp/core";
import { contracts, addresses } from "@tender/contracts";
import stakers from "../../data/stakers";

import ApproveToken from "../approve/ApproveToken";
import ConfirmSwapModal from "./ConfirmSwapModal";
import { useIsTokenApproved } from "../approve/useIsTokenApproved";
import { Transaction } from "grommet-icons";
import { weiToEthWithDecimals } from "../../utils/amountFormat";
import { AmountInputFooter } from "../AmountInputFooter";
import { isLargerThanMax, isPositive, validateIsLargerThanMax, validateIsPositive } from "../../utils/inputValidation";

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
  const logo = `/${stakers[protocolName].bwLogo}`;
  const tenderLogo = `/${stakers[protocolName].bwTenderLogo}`;

  const [showConfirm, setShowConfirm] = useState(false);
  const [isSendingToken, setIsSendingToken] = useState(false);
  const [sendTokenAmount, setSendTokenAmount] = useState("");
  const [receiveTokenAmount, setReceiveTokenAmount] = useState("");

  const tenderTokenSymbol = `t${tokenSymbol}`;
  const tokenSendedSymbol = isSendingToken ? tokenSymbol : tenderTokenSymbol;
  const tokenSendedLogo = isSendingToken ? logo : tenderLogo;
  const tokenReceivedSymbol = isSendingToken ? tenderTokenSymbol : tokenSymbol;
  const tokenReceivedLogo = isSendingToken ? tenderLogo : logo;
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

  const [sendFocused, setSendFocused] = useState(false);
  const [receiveFocused, setReceiveFocused] = useState(false);

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

  const [calcInGivenOut] =
    useContractCall(
      hasValue(tokenSendedLpBalance) &&
        hasValue(tokenSendedWeight) &&
        hasValue(tokenReceivedLpBalance) &&
        hasValue(tokenReceivedWeight) &&
        hasValue(receiveTokenAmount) &&
        hasValue(swapFee) && {
          abi: contracts[protocolName].swap.interface,
          address: addresses[protocolName].swap,
          method: "calcInGivenOut",
          args: [
            tokenSendedLpBalance || "0",
            tokenSendedWeight || "0",
            tokenReceivedLpBalance || "0",
            tokenReceivedWeight || utils.parseEther("1"),
            utils.parseEther(receiveTokenAmount || "0"),
            swapFee || "0",
          ],
        }
    ) ?? [];

  const handleSendTokenInput: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setSendTokenAmount(e.target.value);
  }, []);

  const handleReceiveTokenInput: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setReceiveTokenAmount(e.target.value);
  }, []);

  useEffect(() => {
    if (sendFocused) {
      setReceiveTokenAmount(utils.formatEther(calcOutGivenIn || "0"));
    } else if (receiveFocused) {
      setSendTokenAmount(utils.formatEther(calcInGivenOut || "0"));
    }
  }, [calcInGivenOut, calcOutGivenIn, receiveFocused, receiveTokenAmount, sendFocused, sendTokenAmount]);

  return (
    <Box>
      <Form validate="change">
        <Box align="center" justify="center">
          <Box direction="row" gap="small">
            <FormField
              name="sendAmount"
              label={`Send`}
              validate={[
                validateIsPositive(sendTokenAmount),
                validateIsLargerThanMax(sendTokenAmount, tokenSendedBalance),
              ]}
            >
              <Box width="medium">
                <TextInput
                  id="formSwapSend"
                  type="number"
                  value={sendTokenAmount}
                  icon={
                    <Box pad="xsmall" direction="row" align="center" gap="small">
                      <Image height="35" src={tokenSendedLogo} />
                      <Text>{tokenSendedSymbol}</Text>
                    </Box>
                  }
                  onFocus={() => setSendFocused(true)}
                  onBlur={() => setSendFocused(false)}
                  style={{ textAlign: "right", padding: "20px 50px" }}
                  placeholder={`0`}
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
            <FormField label={`Receive`}>
              <Box width="medium">
                <TextInput
                  id="formSwapReceive"
                  type="number"
                  placeholder={`0 ${tokenReceivedSymbol}`}
                  icon={
                    <Box pad="xsmall" direction="row" align="center" gap="small">
                      <Image height="35" src={tokenReceivedLogo} />
                      <Text>{tokenReceivedSymbol}</Text>
                    </Box>
                  }
                  onFocus={() => setReceiveFocused(true)}
                  onBlur={() => setReceiveFocused(false)}
                  style={{ textAlign: "right", padding: "20px 50px" }}
                  onChange={handleReceiveTokenInput}
                  value={receiveTokenAmount}
                />
              </Box>
            </FormField>
          </Box>
          <Box width="490px" direction="column" gap="small">
            <ApproveToken
              symbol={tokenSendedSymbol}
              spender={addresses[protocolName].swap}
              token={isSendingToken ? contracts[protocolName].token : contracts[protocolName].tenderToken}
              show={!isTokenApproved}
            />
            <Button
              primary
              disabled={
                !isTokenApproved ||
                !isPositive(sendTokenAmount) ||
                isLargerThanMax(sendTokenAmount, tokenSendedBalance) ||
                utils.parseEther(sendTokenAmount).isZero()
              }
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
        sendTokenAmount={calcInGivenOut}
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
