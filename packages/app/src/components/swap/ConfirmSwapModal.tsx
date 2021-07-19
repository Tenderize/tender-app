import { FC, MouseEventHandler, useEffect, useState } from "react";
import { utils, BigNumberish, BigNumber } from "ethers";
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

import { useContractFunction } from "@usedapp/core";
import InfoCard from "../tenderizers/infocard";

type Props = {
  show: boolean;
  onDismiss: () => void;
  tokenSendedSymbol: string;
  tokenReceivedSymbol: string;
  sendTokenAmount: string;
  receiveTokenAmount: BigNumberish;
  tokenSpotPrice: BigNumber;
  tokenSendedAddress: string;
  tokenReceivedAddress: string;
  protocolName: string;
};

const ConfirmSwapModal: FC<Props> = ({
  show,
  tokenSendedSymbol,
  sendTokenAmount,
  tokenReceivedSymbol,
  receiveTokenAmount,
  onDismiss,
  tokenSpotPrice,
  tokenSendedAddress,
  tokenReceivedAddress,
  protocolName,
}) => {
  const [confirmStatus, setConfirmStatus] = useState<"None" | "Waiting" | "Submitted">("None");

  // reset to initial state
  useEffect(() => {
    if (show === true) {
      setConfirmStatus("None");
    }
  }, [show]);

  const { state: swapTx, send: swapExactAmountIn } = useContractFunction(
    contracts[protocolName].swap,
    "swapExactAmountIn",
    { transactionName: `Swap ${tokenSendedSymbol} for ${tokenReceivedSymbol}` }
  );

  const handlePressTrade: MouseEventHandler<HTMLElement> = async (e) => {
    e.preventDefault();
    const amount = utils.parseEther(sendTokenAmount || "0");
    await swapExactAmountIn(tokenSendedAddress, amount, tokenReceivedAddress, receiveTokenAmount, tokenSpotPrice);
    onDismiss();
  };

  useEffect(() => {
    console.log("swapState", swapTx);
    if (swapTx.status === "Mining") {
      setConfirmStatus("Submitted");
    }
  }, [swapTx]);

  return (
    <>
      {show && (
        <Layer
          background="transparent"
          onEsc={() => {
            confirmStatus !== "Submitted" && onDismiss();
          }}
          onClickOutside={() => confirmStatus !== "Submitted" && onDismiss()}
        >
          <Card pad="medium" background="#262528">
            <CardHeader
              justify="center"
              pad={{ bottom: "small" }}
            >{`Confirm Swap ${tokenSendedSymbol} for ${tokenReceivedSymbol}`}</CardHeader>
            <CardBody justify="center" align="center">
              {confirmStatus === "None" && (
                <>
                  <Form>
                    <Box justify="around" align="center">
                      <FormField label={`Send ${tokenSendedSymbol}`}>
                        <TextInput readOnly id="formSwapSend" type="number" value={sendTokenAmount} required={true} />
                      </FormField>
                      <FormField label={`Receive ${tokenReceivedSymbol}`}>
                        <TextInput
                          readOnly
                          id="formSwapReceive"
                          placeholder={"0"}
                          value={utils.formatEther(receiveTokenAmount || "0")}
                        />
                      </FormField>
                    </Box>
                  </Form>
                  <Box>
                    <InfoCard title="Price" text={utils.formatEther(tokenSpotPrice)} />
                  </Box>
                </>
              )}
              {confirmStatus === "Waiting" && (
                <Box justify="center" align="center">
                  <Spinner color="brand" />
                  <Heading textAlign="center">Waiting For Confirmation...</Heading>
                  <Text>
                    Swapping {sendTokenAmount} {tokenSendedSymbol} for {utils.formatEther(receiveTokenAmount || "0")}{" "}
                    {tokenReceivedSymbol}
                  </Text>
                  <Text>Confirm this transaction in your wallet.</Text>
                </Box>
              )}
              {confirmStatus === "Submitted" && (
                <Box justify="center" align="center">
                  <Heading textAlign="center">Transaction is being processed...</Heading>
                  <div className="d-grid p-3">
                    <Button
                      color="success"
                      disabled={swapTx.status !== "Success"}
                      onClick={() => {
                        if (swapTx.status === "Success") {
                          onDismiss();
                        }
                      }}
                    >
                      {swapTx.status === "Success" ? "Close" : <Spinner color="brand" />}
                    </Button>
                  </div>
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
