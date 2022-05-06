import { FC, MouseEventHandler, useEffect, useState } from "react";
import { utils, BigNumber, BigNumberish } from "ethers";
import { contracts } from "@tender/contracts/src/index";
import {
  Button,
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Layer,
  Form,
  FormField,
  Image,
  TextInput,
  Spinner,
  Text,
  Heading,
} from "grommet";

import { useContractFunction } from "@usedapp/core";
import { TransactionListElement } from "components/transactions";
import { getDeadline, getExecutionPrice, useSwapWithPermit } from "utils/tenderSwapHooks";
import { FormClose } from "grommet-icons";
import { isPendingTransaction } from "utils/transactions";
import { stakers } from "@tender/shared/src/index";
import { weiToEthWithDecimals, withDecimals } from "utils/amountFormat";
import { useBalanceValidation } from "utils/inputValidation";
import { AmountInputFooter } from "components/AmountInputFooter";

type Props = {
  show: boolean;
  tokenAddress: string;
  sendTokenAmount: string;
  setSendTokenAmount: (v: string) => void;
  tokenReceiveAmount: BigNumber;
  sendTokenBalance: BigNumberish;
  tokenSendedSymbol: string;
  tokenReceivedSymbol: string;
  priceImpact: number;
  protocolName: string;
  onDismiss: () => void;
  usePermit: boolean;
  owner: string | null | undefined;
  slippage: number;
  setSlippage: (v: number) => void;
};

const ConfirmSwapModal: FC<Props> = ({
  show,
  tokenAddress,
  sendTokenAmount,
  sendTokenBalance,
  setSendTokenAmount,
  tokenReceiveAmount,
  tokenSendedSymbol,
  tokenReceivedSymbol,
  priceImpact,
  protocolName,
  onDismiss,
  usePermit,
  owner,
  slippage,
  setSlippage,
}) => {
  const staker = stakers[protocolName];
  const symbol = staker.symbol;
  const bwLogo = `/${staker.bwLogo}`;
  const bwTenderLogo = `/${staker.bwTenderLogo}`;

  const [confirmStatus, setConfirmStatus] = useState<"None" | "Waiting" | "Submitted" | "Success">("None");

  const tokenAmount = utils.parseEther(sendTokenAmount === "" ? "0.0" : sendTokenAmount);
  const executionPrice = getExecutionPrice(
    tokenReceiveAmount,
    utils.parseEther(sendTokenAmount === "" ? "1" : sendTokenAmount)
  );

  // reset to initial state
  useEffect(() => {
    if (show === true) {
      setConfirmStatus("None");
    }
  }, [show]);

  const { state: swapWithApproveTx, send: swapWithApprove } = useContractFunction(
    contracts[protocolName].tenderSwap,
    "swap",
    {
      transactionName: `Swap ${tokenSendedSymbol} for ${tokenReceivedSymbol}`,
    }
  );

  const { tx: swapWithPermitTx, swapWithPermit } = useSwapWithPermit(
    tokenAddress,
    protocolName,
    tokenSendedSymbol,
    tokenReceivedSymbol,
    owner,
    contracts[protocolName].tenderSwap.address,
    tokenAmount
  );

  const swapTx = usePermit ? swapWithPermitTx : swapWithApproveTx;
  const swap = usePermit ? swapWithPermit : swapWithApprove;

  const minAmount = tokenReceiveAmount.mul(100 - slippage).div(100);

  const handlePressTrade: MouseEventHandler<HTMLElement> = async (e) => {
    e.preventDefault();
    await swap(tokenAddress, tokenAmount, minAmount, getDeadline());
    onDismiss();
  };

  useEffect(() => {
    if (isPendingTransaction(swapTx)) {
      setConfirmStatus("Submitted");
    } else if (swapTx.status === "Success") {
      setConfirmStatus("Success");
    }
  }, [swapTx]);

  const { validationMessage } = useBalanceValidation(sendTokenAmount, sendTokenBalance, tokenSendedSymbol);

  return (
    <>
      {show && (
        <Layer
          style={{ overflow: "auto" }}
          animation="fadeIn"
          onEsc={() => {
            confirmStatus !== "Submitted" && onDismiss();
          }}
          onClickOutside={() => confirmStatus !== "Submitted" && onDismiss()}
        >
          <Card
            flex={false}
            pad={{ vertical: "medium", horizontal: "xlarge" }}
            width="large"
            style={{ position: "relative" }}
          >
            <Button
              style={{ position: "absolute", top: 10, right: 10 }}
              plain
              icon={<FormClose />}
              onClick={onDismiss}
            />
            <CardHeader justify="center" pad="none">
              <Heading level={2} alignSelf="center">
                {`Confirm Swap ${tokenSendedSymbol} for ${tokenReceivedSymbol}`}
              </Heading>
            </CardHeader>
            <CardBody>
              <Box pad={{ top: "medium", horizontal: "large" }} align="center">
                {confirmStatus === "None" && (
                  <Form style={{ width: "100%" }}>
                    <Box gap="medium">
                      <FormField label={`Send ${tokenSendedSymbol}`}>
                        <TextInput
                          id="formSwapSend"
                          type="number"
                          value={sendTokenAmount}
                          onChange={(e) => setSendTokenAmount(e.target.value)}
                          required={true}
                          style={{ textAlign: "right", padding: "20px 50px" }}
                          icon={
                            <Box pad="xsmall" direction="row" align="center" gap="small">
                              <Image height="35" src={tokenSendedSymbol === symbol ? bwLogo : bwTenderLogo} />
                              <Text>{tokenSendedSymbol}</Text>
                            </Box>
                          }
                        />
                        <Text color="red">{validationMessage}</Text>
                        <AmountInputFooter
                          label={`Balance: ${weiToEthWithDecimals(sendTokenBalance, 6)} ${tokenSendedSymbol}`}
                          onClick={() => {
                            setSendTokenAmount(utils.formatEther(sendTokenBalance.toString() ?? "0"));
                          }}
                        />
                      </FormField>
                      <FormField label={`Receive ${tokenReceivedSymbol}`}>
                        <TextInput
                          readOnly
                          id="formSwapReceive"
                          placeholder={"0"}
                          value={weiToEthWithDecimals(tokenReceiveAmount || "0", 5)}
                          style={{ textAlign: "right", padding: "20px 50px" }}
                          icon={
                            <Box pad="xsmall" direction="row" align="center" gap="small">
                              <Image height="35" src={tokenSendedSymbol === symbol ? bwLogo : bwTenderLogo} />
                              <Text>{tokenReceivedSymbol}</Text>
                            </Box>
                          }
                        />
                      </FormField>
                    </Box>
                    <Box pad={{ vertical: "medium" }} gap="small" justify="center" align="right">
                      <Box direction="column" gap="small" alignSelf="end">
                        <Box direction="row" justify="end" align="center" gap="small">
                          <Text>Set slippage</Text>
                          <Button size="small" label="auto" onClick={() => setSlippage(2)} />
                          <Box>
                            <TextInput
                              id="slippage"
                              value={slippage}
                              width={30}
                              maxLength={2}
                              style={{ textAlign: "right", padding: "5px 5px", width: 60 }}
                              onChange={(e) =>
                                setSlippage(Number.parseInt(e.target.value === "" ? "0" : e.target.value))
                              }
                            />
                          </Box>
                          %
                        </Box>
                        <Text textAlign="end">
                          {`Minimum received after ${slippage}% slippage: ${weiToEthWithDecimals(
                            minAmount,
                            5
                          )} ${tokenReceivedSymbol}`}
                        </Text>
                      </Box>
                      <Text textAlign="end">{`Price impact: ${withDecimals(
                        (priceImpact * 100).toString(),
                        2
                      )} %`}</Text>
                      <Text textAlign="end">
                        {`Execution price: ${withDecimals(
                          executionPrice.toString(),
                          5
                        )} ${tokenSendedSymbol} / ${tokenReceivedSymbol}`}
                      </Text>
                    </Box>
                  </Form>
                )}
                {confirmStatus === "Waiting" && (
                  <Box justify="center" align="center" gap="medium">
                    <Spinner size="medium" color="brand" />
                    <Text size="xlarge" textAlign="center">
                      Waiting For Confirmation...
                    </Text>
                    <Text>
                      Swapping {utils.formatEther(tokenAmount || "0")} {tokenSendedSymbol} for{" "}
                      {utils.formatEther(tokenReceiveAmount || "0")} {tokenReceivedSymbol}
                    </Text>
                    <Text>Confirm this transaction in your wallet.</Text>
                  </Box>
                )}
                {confirmStatus === "Submitted" && (
                  <Box justify="center" align="center" gap="medium">
                    <Text size="large" textAlign="center">
                      Transaction is being processed...
                    </Text>
                    <TransactionListElement
                      transaction={swapTx.transaction}
                      title={`Swap ${tokenSendedSymbol} for ${tokenReceivedSymbol}`}
                      icon={undefined}
                    />
                    {swapTx.status !== "Success" && <Spinner size="medium" color="brand" />}
                    <Button primary onClick={onDismiss} label="Dismiss" />
                  </Box>
                )}
                {confirmStatus === "Success" && (
                  <Box justify="center" align="center" gap="medium">
                    <Text size="large" textAlign="center">
                      Transaction was successful!
                    </Text>
                    <TransactionListElement
                      transaction={swapTx.transaction}
                      title={`Swap ${tokenSendedSymbol} for ${tokenReceivedSymbol}`}
                      icon={undefined}
                    />
                    {swapTx.status !== "Success" && <Spinner size="medium" color="brand" />}
                    <Button primary onClick={onDismiss} label="Done" />
                  </Box>
                )}
              </Box>
            </CardBody>
            {confirmStatus === "None" && (
              <CardFooter justify="center" pad={{ vertical: "medium" }}>
                <Box style={{ width: "100%" }} pad={{ horizontal: "large" }} justify="center" gap="small">
                  <Button
                    primary
                    onClick={(e) => {
                      handlePressTrade(e);
                      setConfirmStatus("Waiting");
                    }}
                    label="Confirm Swap"
                  />
                </Box>
              </CardFooter>
            )}
          </Card>
        </Layer>
      )}
    </>
  );
};

export default ConfirmSwapModal;
