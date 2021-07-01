import { FC, useState } from "react";
import { Button, Input } from "rimble-ui";
// import { useContractFunction } from "@usedapp/core";
import { Form, Spinner, Modal } from "react-bootstrap";
import { addresses, contracts } from "@tender/contracts";
import { BigNumber, BigNumberish, utils } from "ethers";
import { useContractFunction } from "@usedapp/core";

type Props = {
  name: string;
  symbol: string;
  tokenBalance: BigNumberish;
  tokenAllowance: BigNumberish;
};

const Farm: FC<Props> = ({ name, symbol, tokenBalance, tokenAllowance }) => {
  // Component state & helpers

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [farmInput, setFarmInput] = useState("");
  const handleFarmInputChange = (e: any) => {
    const val = e.target.value;
    if (val && !val.match(/^(\d+\.?\d*|\.\d+)$/)) return;
    setFarmInput(val);
  };

  const maxDeposit = () => {
    setFarmInput(utils.formatEther(tokenBalance || "0"));
  };

  // Contract Functions

  const { state: approveTx, send: approve } = useContractFunction(contracts[name].liquidity, "approve");
  const approveLpTokens = (e: any) => {
    e.preventDefault();
    approve(addresses[name].farm, utils.parseEther(farmInput || "0"));
  };

  const { state: farmTx, send: farm } = useContractFunction(contracts[name].farm, "farm");
  const farmLpTokens = (e: any) => {
    e.preventDefault();
    farm(utils.parseEther(farmInput || "0"));
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Farm
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{`Farm ${symbol}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="farmLpTokens">
              <Form.Label>Farm amount</Form.Label>
              <Input
                width={1}
                value={farmInput}
                onChange={handleFarmInputChange}
                type="text"
                placeholder={"0 " + symbol}
                className="amount"
              />
              <Form.Text className="balance" onClick={maxDeposit}>
                Current Balance {`${utils.formatEther(tokenBalance?.toString() || "0")} ${symbol}`}
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>

          {/* Show Farm or Approve depending on allowance */}
          {!farmInput || BigNumber.from(tokenAllowance).gte(utils.parseEther(farmInput || "0")) ? (
            <Button
              variant="primary"
              disabled={!farmInput || farmInput.toString() === "0" || farmTx.status === "Mining"}
              onClick={farmLpTokens}
            >
              {farmTx.status === "Mining" ? (
                <>
                  <Spinner animation="border" variant="white" />
                  Farming...
                </>
              ) : (
                "Farm"
              )}
            </Button>
          ) : (
            <Button
              variant="primary"
              disabled={!farmInput || farmInput.toString() === "0" || approveTx.status === "Mining"}
              onClick={approveLpTokens}
            >
              {approveTx.status === "Mining" ? (
                <>
                  {" "}
                  <Spinner animation="border" variant="white" />
                  Approving...
                </>
              ) : (
                "Approve"
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Farm;
