import { ChangeEventHandler, FC, useCallback, useEffect, useRef, useState } from "react";
import { Button, Box, Form, FormField, Image, Text, TextInput, Tip } from "grommet";
import { BigNumberish, utils } from "ethers";
import { useContractCall } from "@usedapp/core";
import { contracts, addresses } from "@tender/contracts";
import stakers from "../../data/stakers";

import ApproveToken from "../approve/ApproveToken";
import ConfirmSwapModal from "./ConfirmSwapModal";
import { useIsTokenApproved } from "../approve/useIsTokenApproved";
import { Transaction } from "grommet-icons";
import { ethWithDecimals, weiToEthWithDecimals } from "../../utils/amountFormat";
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

const ZERO = utils.parseEther("0.0");
const ONE = utils.parseEther("1.0");

const Swap: FC<Props> = ({ tokenSymbol, tokenBalance, tenderTokenBalance, protocolName }) => {
  const logo = `/${stakers[protocolName].bwLogo}`;
  const tenderLogo = `/${stakers[protocolName].bwTenderLogo}`;

  const [showConfirm, setShowConfirm] = useState(false);
  const [isSendingToken, setIsSendingToken] = useState(false);
  const [sendTokenAmount, setSendTokenAmount] = useState("1.0");
  const [receiveTokenAmount, setReceiveTokenAmount] = useState("");

  const tenderTokenSymbol = `t${tokenSymbol}`;
  const tokenSendedSymbol = isSendingToken ? tokenSymbol : tenderTokenSymbol;
  const tokenSendedLogo = isSendingToken ? logo : tenderLogo;
  const tokenReceivedSymbol = isSendingToken ? tenderTokenSymbol : tokenSymbol;
  const tokenReceivedLogo = isSendingToken ? tenderLogo : logo;
  const tokenSendedBalance = isSendingToken ? tokenBalance : tenderTokenBalance;
  const tokenSendedAddress = isSendingToken ? addresses[protocolName].token : addresses[protocolName].tenderToken;

  const isTokenApproved = useIsTokenApproved(tokenSendedAddress, addresses[protocolName].tenderSwap, sendTokenAmount);

  const sendInputRef = useRef<HTMLInputElement | null>(null);

  //  const  isTenderToken = (address: string) => {
  //   return address === addresses[protocolName].tenderToken;
  //  };

  const [tokenSpotPrice] =
    useContractCall({
      abi: contracts[protocolName].tenderSwap.interface,
      address: addresses[protocolName].tenderSwap,
      method: "calculateSwap",
      args: [tokenSendedAddress, ONE],
    }) ?? [];

  const [calcOutGivenIn] = useContractCall({
    abi: contracts[protocolName].tenderSwap.interface,
    address: addresses[protocolName].tenderSwap,
    method: "calculateSwap",
    args: [tokenSendedAddress, sendTokenAmount],
  }) ?? [ZERO];

  const handleSendTokenInput: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setSendTokenAmount(e.target.value);
  }, []);

  console.log("@@@ calcOutGivenIn", calcOutGivenIn);
  useEffect(() => {
    setReceiveTokenAmount(utils.formatEther(calcOutGivenIn || "0"));
  }, [calcOutGivenIn]);

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
                  ref={sendInputRef}
                  id="formSwapSend"
                  type="number"
                  icon={
                    <Box pad="xsmall" direction="row" align="center" gap="small">
                      <Image height="35" src={tokenSendedLogo} />
                      <Text>{tokenSendedSymbol}</Text>
                    </Box>
                  }
                  value={sendTokenAmount}
                  style={{ textAlign: "right", padding: "20px 50px" }}
                  placeholder={`0`}
                  onChange={handleSendTokenInput}
                  required={true}
                />
                <AmountInputFooter
                  label={`Balance: ${weiToEthWithDecimals(tokenSendedBalance, 4)} ${tokenSendedSymbol}`}
                  onClick={() => {
                    setSendTokenAmount(utils.formatEther(tokenSendedBalance.toString() ?? "0"));
                    sendInputRef.current?.focus();
                  }}
                />
              </Box>
            </FormField>
            <Button
              plain
              color="none"
              icon={<Transaction color="white" />}
              onClick={() => setIsSendingToken(!isSendingToken)}
            />
            <Tip
              plain
              dropProps={{
                stretch: "align",
                align: { bottom: "top" },
                round: {
                  size: "20px",
                },
                margin: "none",
                background: "rgba(0,0,0,0.6)",
                elevation: "none",
              }}
              content={
                hasValue(sendTokenAmount) && (
                  <Box width="medium" elevation="none" pad="medium">
                    <Text color="white">{receiveTokenAmount}</Text>
                  </Box>
                )
              }
            >
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
                    disabled
                    style={{ textAlign: "right", padding: "20px 50px" }}
                    value={ethWithDecimals(receiveTokenAmount, 8)}
                  />
                </Box>
              </FormField>
            </Tip>
          </Box>
          <Box width="490px" direction="column" gap="small">
            <ApproveToken
              symbol={tokenSendedSymbol}
              spender={addresses[protocolName].tenderSwap}
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
        tokenAmount={(() => {
          console.log("sendTokenAmount", sendTokenAmount);
          return utils.parseEther(sendTokenAmount === "" ? "0.0" : sendTokenAmount);
        })()}
        tokenReceiveAmount={calcOutGivenIn}
        tokenReceivedSymbol={tokenReceivedSymbol}
        tokenAddress={tokenSendedAddress}
        tokenSpotPrice={tokenSpotPrice}
        protocolName={protocolName}
      />
    </Box>
  );
};

export default Swap;
