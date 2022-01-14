import { ChangeEventHandler, FC, useCallback, useEffect, useRef, useState } from "react";
import { Button, Box, Form, FormField, Image, Text, TextInput, Tip } from "grommet";
import { BigNumberish, utils, constants } from "ethers";
import { contracts, addresses } from "@tender/contracts";
import stakers from "../../data/stakers";
import {calculateSwap, calculateTokenAmount} from "./util"

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
};

const hasValue = (val: any) => {
  return val && val !== "0";
};

const ONE = utils.parseEther("1");

const Swap: FC<Props> = ({ tokenSymbol, tokenBalance, tenderTokenBalance, protocolName }) => {
  const logo = `/${stakers[protocolName].bwLogo}`;
  const tenderLogo = `/${stakers[protocolName].bwTenderLogo}`;

  const [showConfirm, setShowConfirm] = useState(false);
  const [isSendingToken, setIsSendingToken] = useState(false);
  const [sendTokenAmount, setSendTokenAmount] = useState("");
  const [receiveTokenAmount, setReceiveTokenAmount] = useState("");

  const tenderTokenSymbol = `t${tokenSymbol}`;
  const sendTokenSymbol = isSendingToken ? tokenSymbol : tenderTokenSymbol;
  const sendTokenLogo = isSendingToken ? logo : tenderLogo;
  const receiveTokenSymbol = isSendingToken ? tenderTokenSymbol : tokenSymbol;
  const receiveTokenLogo = isSendingToken ? tenderLogo : logo;
  const sendTokenBalance = isSendingToken ? tokenBalance : tenderTokenBalance;
  const sendTokenAddress = isSendingToken ? addresses[protocolName].token : addresses[protocolName].tenderToken;

  const isTokenApproved = useIsTokenApproved(sendTokenAddress, addresses[protocolName].tenderSwap, sendTokenAmount);

  const sendInputRef = useRef<HTMLInputElement | null>(null);

  //  const  isTenderToken = (address: string) => {
  //   return address === addresses[protocolName].tenderToken;
  //  };

  const [tokenSpotPrice] = calculateSwap(addresses[protocolName].tenderSwap, sendTokenAddress, ONE) ?? [constants.Zero]

  const [calcOutGivenIn] = calculateSwap(addresses[protocolName].tenderSwap, sendTokenAddress, utils.parseEther(sendTokenAmount || "0")) ?? [constants.Zero]
  
  const handleSendTokenInput: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setSendTokenAmount(e.target.value);
  }, []);

  console.log("spot price", tokenSpotPrice.toString())
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
                validateIsLargerThanMax(sendTokenAmount, sendTokenBalance),
              ]}
            >
              <Box width="medium">
                <TextInput
                  ref={sendInputRef}
                  id="formSwapSend"
                  type="number"
                  icon={
                    <Box pad="xsmall" direction="row" align="center" gap="small">
                      <Image height="35" src={sendTokenLogo} />
                      <Text>{sendTokenSymbol}</Text>
                    </Box>
                  }
                  value={sendTokenAmount}
                  style={{ textAlign: "right", padding: "20px 50px" }}
                  placeholder={`0`}
                  onChange={handleSendTokenInput}
                  required={true}
                />
                <AmountInputFooter
                  label={`Balance: ${weiToEthWithDecimals(sendTokenBalance, 4)} ${sendTokenSymbol}`}
                  onClick={() => {
                    setSendTokenAmount(utils.formatEther(sendTokenBalance.toString() ?? "0"));
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
                    placeholder={`0 ${receiveTokenSymbol}`}
                    icon={
                      <Box pad="xsmall" direction="row" align="center" gap="small">
                        <Image height="35" src={receiveTokenLogo} />
                        <Text>{receiveTokenSymbol}</Text>
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
              symbol={sendTokenSymbol}
              spender={addresses[protocolName].tenderSwap}
              token={isSendingToken ? contracts[protocolName].token : contracts[protocolName].tenderToken}
              show={!isTokenApproved}
            />
            <Button
              primary
              disabled={
                !isTokenApproved ||
                !isPositive(sendTokenAmount) ||
                isLargerThanMax(sendTokenAmount, sendTokenBalance) ||
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
        sendTokenSymbol={sendTokenSymbol}
        tokenAmount={(() => {
          return utils.parseEther(sendTokenAmount === "" ? "0.0" : sendTokenAmount);
        })()}
        receiveTokenAmount={calcOutGivenIn}
        receiveTokenSymbol={receiveTokenSymbol}
        tokenAddress={sendTokenAddress}
        tokenSpotPrice={tokenSpotPrice}
        protocolName={protocolName}
      />
    </Box>
  );
};

export default Swap;
