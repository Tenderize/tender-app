import { FC, useCallback, useState } from "react";
import { addresses } from "@tender/contracts";
import { BigNumberish, utils } from "ethers";
import {
  Button,
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Layer,
  Form,
  FormField,
  Text,
  TextInput,
} from "grommet";
import { useIsTokenApproved } from "../approve/useIsTokenApproved";
import { AmountInputFooter } from "../AmountInputFooter";
import { FormAdd, FormClose } from "grommet-icons";
import { LoadingButtonContent } from "../LoadingButtonContent";
import { useBalanceValidation } from "utils/inputValidation";
import { useEthers } from "@usedapp/core";
import { isPendingTransaction } from "utils/transactions";
import { useFarm } from "utils/tenderFarmHooks";
import { weiToEthWithDecimals } from "utils/amountFormat";
import { useResetInputAfterTx } from "utils/useResetInputAfterTx";

type Props = {
  protocolName: string;
  symbol: string;
  tokenBalance: BigNumberish;
};

const Farm: FC<Props> = ({ protocolName, symbol, tokenBalance }) => {
  const [show, setShow] = useState(false);
  const { account } = useEthers();

  const handleClose = useCallback(() => setShow(false), []);
  const handleShow = useCallback(() => setShow(true), []);

  const [farmInput, setFarmInput] = useState("");
  const handleFarmInputChange = (e: any) => {
    const val = e.target.value;
    if (val && !val.match(/^(\d+\.?\d*|\.\d+)$/)) return;
    setFarmInput(val);
  };

  const maxDeposit = () => {
    setFarmInput(utils.formatEther(tokenBalance || "0"));
  };

  const isTokenApproved = useIsTokenApproved(
    addresses[protocolName].lpToken,
    account,
    addresses[protocolName].tenderFarm,
    farmInput
  );

  // Contract Functions
  const { farmTx, farm } = useFarm(account, protocolName, symbol, isTokenApproved);

  useResetInputAfterTx(farmTx, setFarmInput);

  const farmLpTokens = async (e: any) => {
    e.preventDefault();
    await farm(utils.parseEther(farmInput || "0"));
    setFarmInput("");
  };

  const { validationMessage } = useBalanceValidation(farmInput, tokenBalance);

  return (
    <>
      <Button primary onClick={handleShow} label="Farm" reverse icon={<FormAdd color="white" />} />
      {show && (
        <Layer style={{ overflow: "auto" }} animation="fadeIn" onEsc={handleClose} onClickOutside={handleClose}>
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
                {`Farm ${symbol}`}
              </Heading>
            </CardHeader>
            <CardBody pad={{ top: "medium", horizontal: "large" }} align="center">
              <Form style={{ width: "100%" }}>
                <FormField protocolName="farmInput">
                  <TextInput
                    value={farmInput}
                    onChange={handleFarmInputChange}
                    type="number"
                    placeholder={"0"}
                    icon={
                      <Box pad="xsmall" direction="row" align="center" gap="small">
                        <Text>{symbol}</Text>
                      </Box>
                    }
                    style={{ textAlign: "right", padding: "20px 50px" }}
                  />
                  <Text color="red">{validationMessage}</Text>
                  <AmountInputFooter
                    label={`Balance: ${weiToEthWithDecimals(tokenBalance?.toString() || "0", 6)} ${symbol}`}
                    onClick={maxDeposit}
                  />
                </FormField>
              </Form>
            </CardBody>
            <CardFooter align="center" justify="center" pad={{ top: "medium" }}>
              <Box justify="center" gap="small">
                <Button
                  primary
                  style={{ width: 467 }}
                  disabled={!farmInput || farmInput.toString() === "0" || isPendingTransaction(farmTx)}
                  onClick={farmLpTokens}
                  label={isPendingTransaction(farmTx) ? <LoadingButtonContent label="Farming..." /> : "Farm"}
                />
              </Box>
            </CardFooter>
          </Card>
        </Layer>
      )}
    </>
  );
};

export default Farm;
