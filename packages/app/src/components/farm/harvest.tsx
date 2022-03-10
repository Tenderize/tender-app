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
  Form,
  Image,
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
import { stakers } from "@tender/shared/src/index";

type Props = {
  protocolName: string;
  symbol: string;
  availableRewards: BigNumberish;
};

const Harvest: FC<Props> = ({ protocolName, symbol, availableRewards }) => {
  // Component state & helpers
  const tenderLogo = `/${stakers[protocolName].bwTenderLogo}`;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Contract Functions
  const { state: harvestTx, send: harvest } = useContractFunction(contracts[protocolName].tenderFarm, "harvest", {
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
            <Image height={18} width={8.69} src={"/harvest.svg"} alt="" />
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
          <Card
            flex={false}
            style={{ position: "relative" }}
            pad={{ vertical: "medium", horizontal: "xlarge" }}
            width="large"
          >
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
              <Form style={{ width: "100%" }}>
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
                        <Image height="35" src={tenderLogo} />
                        <Text>{symbol}</Text>
                      </Box>
                    }
                  />
                </FormField>
              </Form>
            </CardBody>
            <CardFooter align="center" justify="center" pad={{ vertical: "medium" }}>
              <Box direction="row" style={{ width: "100%" }} pad={{ horizontal: "large" }} justify="center" gap="small">
                <Button style={{ width: "100%" }} secondary onClick={handleClose} label="Cancel" />
                <Button
                  style={{ width: "100%" }}
                  primary
                  disabled={!availableRewards || availableRewards.toString() === "0" || isPendingTransaction(harvestTx)}
                  onClick={harvestRewards}
                  label={isPendingTransaction(harvestTx) ? <LoadingButtonContent label="Harvesting..." /> : "Harvest"}
                />
              </Box>
            </CardFooter>
          </Card>
        </Layer>
      )}
    </>
  );
};

export default Harvest;
