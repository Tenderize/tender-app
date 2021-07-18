import { FC, useState } from "react";
// import { useContractFunction } from "@usedapp/core";
import { contracts } from "@tender/contracts";
import { BigNumberish, utils } from "ethers";
import { useContractFunction } from "@usedapp/core";
import { Button, Box, Card, CardHeader, CardBody, CardFooter, Layer, Spinner, Text } from 'grommet'

type Props = {
  name: string;
  symbol: string;
  availableRewards: BigNumberish;
};

const Harvest: FC<Props> = ({ name, symbol, availableRewards }) => {
  // Component state & helpers

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Contract Functions
  const { state: harvestTx, send: harvest } = useContractFunction(contracts[name].farm, "harvest", {
    transactionName: `Harvest ${symbol}`,
  });
  const harvestRewards = (e: any) => {
    e.preventDefault();
    harvest();
  };

  return (
    <>
      <Button secondary onClick={handleShow}>
        Harvest
      </Button>

      {show &&
        <Layer onEsc={() => setShow(false)}
        onClickOutside={() => setShow(false)}>
          <Card>
            <CardHeader>
            {`Harvest ${symbol}`}
            </CardHeader>
            <CardBody>
              <Text className="balance">
              Available for harvest: {`${utils.formatEther(availableRewards?.toString() || "0")} ${symbol}`}
              </Text>
            </CardBody>
            <CardFooter>
            <Button primary onClick={handleClose}>
            Cancel
          </Button>

          <Button
            secondary
            disabled={!availableRewards || availableRewards.toString() === "0" || harvestTx.status === "Mining"}
            onClick={harvestRewards}
          >
            {harvestTx.status === "Mining" ? (
              <Box direction="row">
                <Spinner color="white" />
                Harvesting...
              </Box>
            ) : (
              "Harvest"
            )}
          </Button>
            </CardFooter>
          </Card>
        </Layer>
      }
    </>
  );
};

export default Harvest;
