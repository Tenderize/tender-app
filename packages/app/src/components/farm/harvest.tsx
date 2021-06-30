import { FC, useState } from "react";
import { Button, Text } from "rimble-ui";
// import { useContractFunction } from "@usedapp/core";
import { Spinner, Modal} from "react-bootstrap";
import { contracts } from "@tender/contracts";
import { BigNumberish, utils } from "ethers";
import { useContractFunction } from "@usedapp/core";

type Props = {
    name: string;
    symbol: string;
    availableRewards: BigNumberish;
}

const Harvest: FC<Props> = ({name, symbol, availableRewards}) => {
    // Component state & helpers

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Contract Functions
    const {state: harvestTx, send: harvest} = useContractFunction(contracts[name].farm, "harvest")
    const harvestRewards = (e: any) => {
        e.preventDefault()
        harvest()
    }

    return (
        <>
        <Button variant="primary" onClick={handleShow}>
            Harvest
        </Button>

        <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{`Harvest ${symbol}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Text className="balance">
                Available for harvest: {`${utils.formatEther(availableRewards?.toString() || "0")} ${symbol}`}
            </Text>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>

          <Button
            variant="primary"
            disabled={!availableRewards || availableRewards.toString() === "0" || harvestTx.status === "Mining"}
            onClick={harvestRewards}
            >
            {harvestTx.status === "Mining" ? (
                <>
                <Spinner animation="border" variant="white" />
                Harvesting...
                </>
            ) : (
                "Harvest"
            )}
            </Button>              
         
        </Modal.Footer>
      </Modal>

        </>
    );
};

export default Harvest;
