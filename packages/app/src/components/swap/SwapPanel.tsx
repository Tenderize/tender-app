import { FC, MouseEventHandler, useEffect, useState } from "react";
import { utils } from "ethers";
import { addresses, contracts } from "@tender/contracts/src/index";
import {
  Button,
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
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
import { getDeadline, useCalculateSwap, usePriceImpact, useSwapWithPermit } from "utils/tenderSwapHooks";
import { isPendingTransaction } from "utils/transactions";
import { stakers, theme } from "@tender/shared/src/index";
import { weiToEthWithDecimals, withDecimals } from "utils/amountFormat";
import { useIsTokenApproved } from "components/approve/useIsTokenApproved";
import { normalizeColor } from "grommet/utils";
import TenderBox from "components/tenderbox";

type Props = {
  protocolName: string;
  account: string | null | undefined;
  //   tokenBalance: BigNumberish;
  //   tenderTokenBalance: BigNumberish;
};

const ONE = utils.parseEther("1");

const SwapPanel: FC<Props> = ({ protocolName, account }) => {
  const staker = stakers[protocolName];
  const tokenSymbol = staker.symbol;
  const logo = `/${staker.bwLogo}`;
  const tenderLogo = `/${staker.bwTenderLogo}`;

  const [sendTokenAmount, setSendTokenAmount] = useState("");
  const [receiveTokenAmount, setReceiveTokenAmount] = useState("");
  const [isSendingToken, setIsSendingToken] = useState(false);
  const tenderTokenSymbol = `t${staker.symbol}`;
  const sendTokenSymbol = isSendingToken ? tokenSymbol : tenderTokenSymbol;
  const tokenReceivedSymbol = isSendingToken ? tenderTokenSymbol : tokenSymbol;
  const sendTokenAddress = isSendingToken ? addresses[protocolName].token : addresses[protocolName].tenderToken;

  const [confirmStatus, setConfirmStatus] = useState<"None" | "Waiting" | "Submitted" | "Success">("None");
  const [slippage, setSlippage] = useState(2);

  const isTokenApproved = useIsTokenApproved(
    sendTokenAddress,
    account,
    addresses[protocolName].tenderSwap,
    sendTokenAmount
  );

  const tokenAmount = utils.parseEther(sendTokenAmount === "" ? "0.0" : sendTokenAmount);

  const hasPermit = isSendingToken ? staker.hasPermit && !isTokenApproved : !isTokenApproved;
  // reset to initial state
  //   useEffect(() => {
  //     if (show === true) {
  //       setConfirmStatus("None");
  //     }
  //   }, [show]);

  const executionPrice = useCalculateSwap(addresses[protocolName].tenderSwap, sendTokenAddress, ONE);

  const calcOutGivenIn = useCalculateSwap(
    addresses[protocolName].tenderSwap,
    sendTokenAddress,
    utils.parseEther(sendTokenAmount || "0")
  );

  const { priceImpact } = usePriceImpact(
    isSendingToken,
    addresses[protocolName].tenderSwap,
    sendTokenAmount,
    calcOutGivenIn
  );

  const { state: swapWithApproveTx, send: swapWithApprove } = useContractFunction(
    contracts[protocolName].tenderSwap,
    "swap",
    {
      transactionName: `Swap ${sendTokenSymbol} for ${tokenReceivedSymbol}`,
    }
  );

  const { tx: swapWithPermitTx, swapWithPermit } = useSwapWithPermit(
    sendTokenAddress,
    protocolName,
    sendTokenSymbol,
    tokenReceivedSymbol,
    account,
    contracts[protocolName].tenderSwap.address,
    tokenAmount
  );

  const swapTx = hasPermit ? swapWithPermitTx : swapWithApproveTx;
  const swap = hasPermit ? swapWithPermit : swapWithApprove;

  const minAmount = calcOutGivenIn.mul(100 - slippage).div(100);

  const handlePressTrade: MouseEventHandler<HTMLElement> = async (e) => {
    e.preventDefault();
    await swap(sendTokenAddress, tokenAmount, minAmount, getDeadline());
  };

  useEffect(() => {
    if (isPendingTransaction(swapTx)) {
      setConfirmStatus("Submitted");
    } else if (swapTx.status === "Success") {
      setConfirmStatus("Success");
    }
  }, [swapTx]);

  return (
    <TenderBox>
      <Card
        flex={false}
        pad={{ vertical: "medium", horizontal: "medium" }}
        width="35rem"
        //  style={{ background: normalizeColor("modalBackground", theme) }}
      >
        <CardHeader justify="start" pad="none">
          <Heading margin="none" level={3} alignSelf="center">
            Swap
          </Heading>
        </CardHeader>
        <CardBody>
          <Box pad={{ top: "medium" }} align="center">
            {confirmStatus === "None" && (
              <Form style={{ width: "100%" }}>
                <Box gap="medium">
                  <FormField label={`Send ${sendTokenSymbol}`}>
                    <TextInput
                      readOnly
                      id="formSwapSend"
                      type="number"
                      value={utils.formatEther(tokenAmount || "0")}
                      required={true}
                      style={{ textAlign: "right", padding: "20px 50px" }}
                      icon={
                        <Box pad="xsmall" direction="row" align="center" gap="small">
                          <Image height="35" src={sendTokenSymbol === tokenSymbol ? logo : tenderLogo} />
                          <Text>{sendTokenSymbol}</Text>
                        </Box>
                      }
                    />
                  </FormField>
                  <FormField label={`Receive ${tokenReceivedSymbol}`}>
                    <TextInput
                      readOnly
                      id="formSwapReceive"
                      placeholder={"0"}
                      value={weiToEthWithDecimals(calcOutGivenIn || "0", 5)}
                      style={{ textAlign: "right", padding: "20px 50px" }}
                      icon={
                        <Box pad="xsmall" direction="row" align="center" gap="small">
                          <Image height="35" src={sendTokenSymbol === tokenSymbol ? logo : tenderLogo} />
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
                          onChange={(e) => setSlippage(Number.parseInt(e.target.value === "" ? "0" : e.target.value))}
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
                  <Text textAlign="end">{`Price impact: ${withDecimals(priceImpact.toString(), 2)} %`}</Text>
                  <Text textAlign="end">
                    {`Execution price: ${weiToEthWithDecimals(
                      executionPrice,
                      5
                    )} ${sendTokenSymbol} / ${tokenReceivedSymbol}`}
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
                  Swapping {utils.formatEther(tokenAmount || "0")} {sendTokenSymbol} for{" "}
                  {utils.formatEther(calcOutGivenIn || "0")} {tokenReceivedSymbol}
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
                  title={`Swap ${sendTokenSymbol} for ${tokenReceivedSymbol}`}
                  icon={undefined}
                />
                {swapTx.status !== "Success" && <Spinner size="medium" color="brand" />}
                <Button primary label="Dismiss" />
              </Box>
            )}
            {confirmStatus === "Success" && (
              <Box justify="center" align="center" gap="medium">
                <Text size="large" textAlign="center">
                  Transaction was successful!
                </Text>
                <TransactionListElement
                  transaction={swapTx.transaction}
                  title={`Swap ${sendTokenSymbol} for ${tokenReceivedSymbol}`}
                  icon={undefined}
                />
                {swapTx.status !== "Success" && <Spinner size="medium" color="brand" />}
                <Button primary label="Done" />
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
    </TenderBox>
  );
};

export default SwapPanel;
