import { FC, useState } from "react";
import { contracts } from "@tender/contracts";
import { BigNumberish } from "ethers";
import {
  Button,
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Layer,
  Text,
  Heading,
  FormField,
  TextInput,
} from "grommet";
import { LoadingButtonContent } from "../LoadingButtonContent";
import { useContractFunction } from "@usedapp/core";
import { FormClose } from "grommet-icons";
import { isPendingTransaction } from "utils/transactions";
import { weiToEthWithDecimals } from "utils/amountFormat";

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
            <CardHeader justify="center" pad="none">
              <Heading level={2} alignSelf="center">
                {`Harvest ${symbol}`}
              </Heading>
            </CardHeader>
            <CardBody pad={{ top: "medium", horizontal: "large" }} align="center">
              <FormField label="Available for harvest:">
                <TextInput
                  readOnly
                  disabled
                  value={weiToEthWithDecimals(availableRewards, 6)}
                  placeholder={"0"}
                  type="number"
                  style={{ textAlign: "right", padding: "20px 50px" }}
                  icon={
                    <Box pad="xsmall" direction="row" align="center" gap="small">
                      <Text>{symbol}</Text>
                    </Box>
                  }
                />
              </FormField>
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
