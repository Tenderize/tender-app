import { FC, MouseEventHandler, useEffect, useState } from "react";
import { utils, BigNumber } from "ethers";
import { contracts } from "@tender/contracts";
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
  TextInput,
  Spinner,
  Text,
  Heading,
} from "grommet";

import { InfoCard } from "@tender/shared/src/index";
import { useContractFunction } from "@usedapp/core";
import { TransactionListElement } from "components/transactions";
import { getDeadline } from "utils/tenderSwapHooks";
import { FormClose } from "grommet-icons";
import { isPendingTransaction } from "utils/transactions";

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
}) => {
  const [confirmStatus, setConfirmStatus] = useState<"None" | "Waiting" | "Submitted" | "Success">("None");

  // reset to initial state
  useEffect(() => {
    if (show === true) {
      setConfirmStatus("None");
    }
  }, [show]);

  const { state: swapTx, send: swap } = useContractFunction(contracts[protocolName].tenderSwap, "swap", {
    transactionName: `Swap ${tokenSendedSymbol} for ${tokenReceivedSymbol}`,
  });

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
          <Card flex={false} style={{ position: "relative" }} pad="medium">
            <Button
              style={{ position: "absolute", top: 10, right: 10 }}
              plain
              icon={<FormClose />}
              onClick={onDismiss}
            />
            <CardHeader justify="center" pad={{ bottom: "small" }}>
              <Heading level={2} alignSelf="center">
                {`Confirm Swap ${tokenSendedSymbol} for ${tokenReceivedSymbol}`}
              </Heading>
            </CardHeader>
            <CardBody justify="center" align="center">
              {confirmStatus === "None" && (
                <>
                  <Form>
                    <Box justify="around" align="center">
                      <FormField label={`Send ${tokenSendedSymbol}`}>
                        <TextInput
                          readOnly
                          id="formSwapSend"
                          type="number"
                          value={utils.formatEther(tokenAmount || "0")}
                          required={true}
                        />
                      </FormField>
                      <FormField label={`Receive ${tokenReceivedSymbol}`}>
                        <TextInput
                          readOnly
                          id="formSwapReceive"
                          placeholder={"0"}
                          value={utils.formatEther(tokenReceiveAmount || "0")}
                        />
                      </FormField>
                    </Box>
                  </Form>
                  <Box>
                    <InfoCard title="Price" text={`${utils.formatEther(tokenSpotPrice)} ${tokenSendedSymbol}`} />
                  </Box>
                </>
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
            </CardBody>
            {confirmStatus === "None" && (
              <CardFooter justify="center" pad={{ top: "small" }}>
                <Button
                  primary
                  onClick={(e) => {
                    handlePressTrade(e);
                    setConfirmStatus("Waiting");
                  }}
                  label="Confirm Swap"
                />
              </CardFooter>
            )}
          </Card>
        </Layer>
      )}
    </>
  );
};

export default ConfirmSwapModal;
