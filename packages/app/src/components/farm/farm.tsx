import { FC, useState } from "react";
import { Input } from "rimble-ui";
// import { useContractFunction } from "@usedapp/core";
import { Form, Spinner, Modal, Button } from "react-bootstrap";
import { addresses, contracts } from "@tender/contracts";
import { BigNumber, BigNumberish, utils } from "ethers";
import { useContractFunction } from "@usedapp/core";

import ApproveToken from "../approve/ApproveToken"
import {useIsTokenApproved} from "../approve/useIsTokenApproved"

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

  const isTokenapproved = useIsTokenApproved(addresses[name].liquidity, addresses[name].farm, farmInput)

  // Contract Functions
  const { state: farmTx, send: farm } = useContractFunction(contracts[name].farm, "farm", {
    transactionName: `Farm ${symbol}`,
  });

  const farmLpTokens = async (e: any) => {
    e.preventDefault();
    await farm(utils.parseEther(farmInput || "0"));
    setFarmInput("")
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
          <div className="d-grid gap-2">
            <ApproveToken 
              symbol={symbol}
              spender={addresses[name].farm}
              token={contracts[name].liquidity}
              hasAllowance={isTokenapproved}
            />
            <Button
              block
              variant="primary"
              disabled={!isTokenapproved || !farmInput || farmInput.toString() === "0" || farmTx.status === "Mining"}
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
            </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Farm;
