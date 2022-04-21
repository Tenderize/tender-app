import { FC, MouseEventHandler, useEffect, useState } from "react";
import { utils, BigNumber } from "ethers";
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
import { getDeadline, useSwapWithPermit } from "utils/tenderSwapHooks";
import { FormClose } from "grommet-icons";
import { isPendingTransaction } from "utils/transactions";
import { stakers } from "@tender/shared/src/index";
import { weiToEthWithDecimals } from "utils/amountFormat";

type Props = {
  show: boolean;
  tokenAddress: string;
  tokenAmount: BigNumber;
  tokenReceiveAmount: BigNumber;
  tokenSendedSymbol: string;
  tokenReceivedSymbol: string;
  tokenSpotPrice: BigNumber;
  protocolName: string;
  onDismiss: () => void;
  usePermit: boolean;
  owner: string | null | undefined;
};

const ConfirmSwapModal: FC<Props> = ({
  show,
  tokenAddress,
  tokenAmount,
  tokenReceiveAmount,
  tokenSendedSymbol,
  tokenReceivedSymbol,
  tokenSpotPrice,
  protocolName,
  onDismiss,
  usePermit,
  owner,
}) => {
  const staker = stakers[protocolName];
  const symbol = staker.symbol;
  const bwLogo = `/${staker.bwLogo}`;
  const bwTenderLogo = `/${staker.bwTenderLogo}`;

  const [confirmStatus, setConfirmStatus] = useState<"None" | "Waiting" | "Submitted" | "Success">("None");

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

  const minAmount = tokenReceiveAmount.mul(98).div(100);

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
                          readOnly
                          id="formSwapSend"
                          type="number"
                          value={utils.formatEther(tokenAmount || "0")}
                          required={true}
                          style={{ textAlign: "right", padding: "20px 50px" }}
                          icon={
                            <Box pad="xsmall" direction="row" align="center" gap="small">
                              <Image height="35" src={tokenSendedSymbol === symbol ? bwLogo : bwTenderLogo} />
                              <Text>{tokenSendedSymbol}</Text>
                            </Box>
                          }
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
                    <Box pad={{ vertical: "medium" }} justify="center" align="right">
                      <Text textAlign="end">
                        {`Minimum received after 2% slippage: ${weiToEthWithDecimals(
                          tokenSpotPrice,
                          5
                        )} ${tokenSendedSymbol} / ${tokenReceivedSymbol}`}
                      </Text>
                      <Text textAlign="end">
                        {`Exchange rate: ${weiToEthWithDecimals(
                          tokenSpotPrice,
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
