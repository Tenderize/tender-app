import { FC, useState } from "react";
// import { useContractFunction } from "@usedapp/core";
import { contracts } from "@tender/contracts";
import { BigNumberish, utils } from "ethers";
import { useContractFunction } from "@usedapp/core";
import { Button, Box, Card, CardHeader, CardBody, CardFooter, Layer, Spinner, Text } from "grommet";

const harvestIcon = require("../../images/harvest.svg");

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
      <Button
        primary
        color="light-2"
        onClick={handleShow}
        label={
          <Box direction="row" align="center" justify="center" gap="small">
            <img height={18} width={8.69} src={harvestIcon.default} alt="" />
            <Text>Harvest</Text>
          </Box>
        }
        style={{ color: "#4E66DE" }}
      />
      {show && (
        <Layer animation="fadeIn" onEsc={() => setShow(false)} onClickOutside={() => setShow(false)}>
          <Card pad="medium" width="large">
            <CardHeader justify="center" pad={{ bottom: "small" }}>{`Harvest ${symbol}`}</CardHeader>
            <CardBody align="center">
              <Text className="balance">
                Available for harvest: {`${utils.formatEther(availableRewards?.toString() || "0")} ${symbol}`}
              </Text>
            </CardBody>
            <CardFooter align="center" justify="center" pad={{ top: "medium" }}>
              <Button secondary onClick={handleClose} label="Cancel" />
              <Button
                primary
                disabled={!availableRewards || availableRewards.toString() === "0" || harvestTx.status === "Mining"}
                onClick={harvestRewards}
                label={
                  harvestTx.status === "Mining" ? (
                    <Box direction="row">
                      <Spinner color="white" />
                      Harvesting...
                    </Box>
                  ) : (
                    "Harvest"
                  )
                }
              />
            </CardFooter>
          </Card>
        </Layer>
      )}
    </>
  );
};

export default Harvest;
