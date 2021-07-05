import { FC, useState } from "react";
import { Input } from "rimble-ui";
// import { useContractFunction } from "@usedapp/core";
import { Form, Spinner, Modal, Button } from "react-bootstrap";
import { contracts } from "@tender/contracts";
import { BigNumberish, utils } from "ethers";
import { useContractFunction } from "@usedapp/core";

type Props = {
  name: string;
  symbol: string;
  stake: BigNumberish;
};

const Unfarm: FC<Props> = ({ name, symbol, stake }) => {
  // Component state & helpers

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [unfarmInput, setUnfarmInput] = useState("");
  const handleUnfarmInputChange = (e: any) => {
    const val = e.target.value;
    if (val && !val.match(/^(\d+\.?\d*|\.\d+)$/)) return;
    setUnfarmInput(val);
  };

  const maxUnfarm = () => {
    console.log(stake);
    setUnfarmInput(utils.formatEther(stake.toString() || "0"));
  };

  // Contract Functions

  const { state: unfarmTx, send: unfarm } = useContractFunction(contracts[name].farm, "unfarm");
  const unfarmLpTokens = async (e: any) => {
    e.preventDefault();
    await unfarm(utils.parseEther(unfarmInput || "0"));
    setUnfarmInput("")
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Unfarm
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{`Unfarm ${symbol}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="unfarmLpTokens">
              <Form.Label>Unarm amount</Form.Label>
              <Input
                width={1}
                value={unfarmInput}
                onChange={handleUnfarmInputChange}
                type="text"
                placeholder={"0 " + symbol}
                className="amount"
              />
              <Form.Text className="balance" onClick={maxUnfarm}>
                Current Stake {`${utils.formatEther(stake?.toString() || "0")} ${symbol}`}
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>

          <Button
            variant="primary"
            disabled={!unfarmInput || unfarmInput.toString() === "0" || unfarmTx.status === "Mining"}
            onClick={unfarmLpTokens}
          >
            {unfarmTx.status === "Mining" ? (
              <>
                <Spinner animation="border" variant="white" />
                Unfarming...
              </>
            ) : (
              "Unfarm"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Unfarm;
