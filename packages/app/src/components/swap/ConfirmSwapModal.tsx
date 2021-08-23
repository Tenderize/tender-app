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
} from "grommet";

import InfoCard from "../tenderizers/infocard";
import { useContractFunction } from "../../utils/useDappPatch";

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
          style={{ overflow: "auto" }}
          animation="fadeIn"
          onEsc={() => {
            confirmStatus !== "Submitted" && onDismiss();
          }}
          onClickOutside={() => confirmStatus !== "Submitted" && onDismiss()}
        >
          <Card flex={false} pad="medium">
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
                    Swapping {sendTokenAmount} {tokenSendedSymbol} for {utils.formatEther(receiveTokenAmount || "0")}{" "}
                    {tokenReceivedSymbol}
                  </Text>
                  <Text>Confirm this transaction in your wallet.</Text>
                </Box>
              )}
              {confirmStatus === "Submitted" && (
                <Box justify="center" align="center" gap="medium">
                  <Text size="large" textAlign="center">
                    Transaction is being processed...
                  </Text>
                  {swapTx.status !== "Success" && <Spinner size="medium" color="brand" />}
                  <Button primary onClick={onDismiss} label="Dismiss" />
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
