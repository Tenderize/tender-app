import { FC, MouseEventHandler, useEffect, useState } from "react";
import { Card, Container, Form, FormControl, Modal, Button, InputGroup, Spinner } from "react-bootstrap";
import { utils, BigNumberish, BigNumber } from "ethers";
import { contracts } from "@tender/contracts";

import { useContractFunction } from "@usedapp/core";

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
    "swapExactAmountIn"
  );

  const handlePressTrade: MouseEventHandler<HTMLElement> = async (e) => {
    e.preventDefault();
    const amount = utils.parseEther(sendTokenAmount || "0");
    await swapExactAmountIn(tokenSendedAddress, amount, tokenReceivedAddress, receiveTokenAmount, tokenSpotPrice);
    onDismiss()
  };

  useEffect(() => {
    console.log("swapState", swapTx);
    if (swapTx.status === "Mining") {
      setConfirmStatus("Submitted");
    }
  }, [swapTx]);

  return (
    <Modal show={show} onHide={confirmStatus !== "Submitted" && onDismiss}>
      <Modal.Header>
        <Modal.Title>{"Confirm Swap"}</Modal.Title>
      </Modal.Header>
      {confirmStatus === "None" && (
        <>
          <Modal.Body>
            <Form>
              <Form.Label>From</Form.Label>
              <Form.Group className="mb-3">
                <InputGroup className="mb-2" hasValidation={true}>
                  <InputGroup.Text>{tokenSendedSymbol}</InputGroup.Text>
                  <Form.Control id="formSwapSend" type="number" value={sendTokenAmount} required={true} />
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>To</Form.Label>
                <InputGroup className="mb-2">
                  <InputGroup.Text>{tokenReceivedSymbol}</InputGroup.Text>
                  <FormControl
                    id="formSwapReceive"
                    placeholder={"0"}
                    value={utils.formatEther(receiveTokenAmount || "0")}
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Form.Label>Price</Form.Label>
                  <Form.Label>
                    1 {tokenSendedSymbol} = {utils.formatEther(tokenSpotPrice)} {tokenReceivedSymbol}
                  </Form.Label>
                </div>
              </Form.Group>
            </Form>
          </Modal.Body>
          <div className="d-grid p-3">
            <Button
              variant="primary"
              onClick={(e) => {
                handlePressTrade(e);
                setConfirmStatus("Waiting");
              }}
            >
              Confirm Swap
            </Button>
          </div>
        </>
      )}
      {confirmStatus === "Waiting" && (
        <>
          <Container className="text-center align-items-center pt-3">
            <Spinner animation="border" variant="primary" />
            <Card.Body>
              <Card.Title>Waiting For Confirmation</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Swapping {sendTokenAmount} {tokenSendedSymbol} for {utils.formatEther(receiveTokenAmount || "0")}{" "}
                {tokenReceivedSymbol}
              </Card.Subtitle>
              <Card.Text>Confirm this transaction in your wallet.</Card.Text>
            </Card.Body>
          </Container>
        </>
      )}
      {confirmStatus === "Submitted" && (
        <>
          <Container className="text-center align-items-center pt-3">
            <Card.Body>
              <Card.Title>Transaction is being processed...</Card.Title>
            </Card.Body>
            <div className="d-grid p-3">
              <Button
                variant="primary"
                disabled={swapTx.status !== "Success"}
                onClick={() => {
                  if (swapTx.status === "Success") {
                    onDismiss();
                  }
                }}
              >
                {swapTx.status === "Success" ? "Close" : <Spinner animation="border" />}
              </Button>
            </div>
          </Container>
        </>
      )}
    </Modal>
  );
};

export default ConfirmSwapModal;
