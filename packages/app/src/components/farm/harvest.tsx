import { FC, useState } from "react";
import { contracts } from "@tender/contracts";
import { BigNumberish, utils } from "ethers";
import { Button, Box, Card, CardHeader, CardBody, CardFooter, Layer, Text, Heading } from "grommet";
import { LoadingButtonContent } from "../LoadingButtonContent";
import { useContractFunction } from "@usedapp/core";
import { FormClose } from "grommet-icons";
import { isPendingTransaction } from "utils/transactions";

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
  const { state: harvestTx, send: harvest } = useContractFunction(contracts[name].tenderFarm, "harvest", {
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
            <Text>Harvest</Text>
            <img height={18} width={8.69} src={"/harvest.svg"} alt="" />
          </Box>
        }
        style={{ color: "#4E66DE" }}
      />
      {show && (
        <Layer
          style={{ overflow: "auto" }}
          animation="fadeIn"
          onEsc={() => setShow(false)}
          onClickOutside={() => setShow(false)}
        >
          <Card flex={false} style={{ position: "relative" }} pad="medium" width="large">
            <Button
              style={{ position: "absolute", top: 10, right: 10 }}
              plain
              icon={<FormClose />}
              onClick={handleClose}
            />
            <CardHeader justify="center" pad={{ bottom: "small" }}>
              <Heading level={2} alignSelf="center">
                {`Harvest ${symbol}`}
              </Heading>
            </CardHeader>
            <CardBody align="center">
              <Text>
                Available for harvest: {`${utils.formatEther(availableRewards?.toString() || "0")} ${symbol}`}
              </Text>
            </CardBody>
            <CardFooter align="center" justify="center" pad={{ top: "medium" }}>
              <Button secondary onClick={handleClose} label="Cancel" />
              <Button
                primary
                disabled={!availableRewards || availableRewards.toString() === "0" || isPendingTransaction(harvestTx)}
                onClick={harvestRewards}
                label={isPendingTransaction(harvestTx) ? <LoadingButtonContent label="Harvesting..." /> : "Harvest"}
              />
            </CardFooter>
          </Card>
        </Layer>
      )}
    </>
  );
};

export default Harvest;
