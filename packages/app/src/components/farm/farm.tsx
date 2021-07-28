import { FC, useCallback, useState } from "react";
import { addresses, contracts } from "@tender/contracts";
import { BigNumberish, utils } from "ethers";
import { useContractFunction } from "@usedapp/core";
import {
  Button,
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Layer,
  Form,
  FormField,
  TextInput,
  Spinner,
  Text,
} from "grommet";
import ApproveToken from "../approve/ApproveToken";
import { useIsTokenApproved } from "../approve/useIsTokenApproved";

type Props = {
  name: string;
  symbol: string;
  tokenBalance: BigNumberish;
  tokenAllowance: BigNumberish;
};

const Farm: FC<Props> = ({ name, symbol, tokenBalance, tokenAllowance }) => {
  // Component state & helpers

  const [show, setShow] = useState(false);

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

  const isTokenApproved = useIsTokenApproved(addresses[name].liquidity, addresses[name].farm, farmInput);

  // Contract Functions
  const { state: farmTx, send: farm } = useContractFunction(contracts[name].farm, "farm", {
    transactionName: `Farm ${symbol}`,
  });

  const farmLpTokens = async (e: any) => {
    e.preventDefault();
    await farm(utils.parseEther(farmInput || "0"));
    setFarmInput("");
  };

  return (
    <>
      <Button primary onClick={handleShow} label="Farm" />
      {show && (
        <Layer animation="fadeIn" onEsc={handleClose} onClickOutside={handleClose}>
          <Card pad="medium" width="large">
            <CardHeader justify="center" pad={{ bottom: "small" }}>{`Farm ${symbol}`}</CardHeader>
            <CardBody>
              <Form>
                <FormField>
                  <TextInput
                    value={farmInput}
                    onChange={handleFarmInputChange}
                    type="text"
                    placeholder={"0 " + symbol}
                    className="amount"
                  />
                  <Text className="balance" onClick={maxDeposit}>
                    Current Balance {`${utils.formatEther(tokenBalance?.toString() || "0")} ${symbol}`}
                  </Text>
                </FormField>
              </Form>
            </CardBody>
            <CardFooter align="center" justify="center" pad={{ top: "medium" }}>
              <Box justify="center" gap="small">
                <ApproveToken
                  symbol={symbol}
                  spender={addresses[name].farm}
                  token={contracts[name].liquidity}
                  hasAllowance={isTokenApproved}
                />
                <Button
                  primary
                  disabled={
                    !isTokenApproved || !farmInput || farmInput.toString() === "0" || farmTx.status === "Mining"
                  }
                  onClick={farmLpTokens}
                  label={
                    farmTx.status === "Mining" ? (
                      <Box direction="row">
                        <Spinner color="white" />
                        Farming...
                      </Box>
                    ) : (
                      "Farm"
                    )
                  }
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
