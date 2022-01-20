import { FC, useCallback, useState } from "react";
import { addresses, contracts } from "@tender/contracts";
import { BigNumberish, utils } from "ethers";
import { Button, Box, Card, CardHeader, CardBody, CardFooter, Layer, Form, FormField, TextInput } from "grommet";
import ApproveToken from "../approve/ApproveToken";
import { useIsTokenApproved } from "../approve/useIsTokenApproved";
import { AmountInputFooter } from "../AmountInputFooter";
import { FormAdd } from "grommet-icons";
import { LoadingButtonContent } from "../LoadingButtonContent";
import { validateIsLargerThanMax, validateIsPositive } from "../../utils/inputValidation";
import { useContractFunction } from "../../utils/useDappPatch";
import { useEthers } from "@usedapp/core";

type Props = {
  name: string;
  symbol: string;
  tokenBalance: BigNumberish;
};

const Farm: FC<Props> = ({ name, symbol, tokenBalance }) => {
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

  const isTokenApproved = useIsTokenApproved(addresses[name].lpToken, account, addresses[name].tenderFarm, farmInput);

  // Contract Functions
  const { state: farmTx, send: farm } = useContractFunction(contracts[name].tenderFarm, "farm", {
    transactionName: `Farm ${symbol}`,
  });

  const farmLpTokens = async (e: any) => {
    e.preventDefault();
    await farm(utils.parseEther(farmInput || "0"));
    setFarmInput("");
  };

  return (
    <>
      <Button primary onClick={handleShow} label="Farm" reverse icon={<FormAdd color="white" />} />
      {show && (
        <Layer style={{ overflow: "auto" }} animation="fadeIn" onEsc={handleClose} onClickOutside={handleClose}>
          <Card flex={false} pad="medium" width="large">
            <CardHeader justify="center" pad={{ bottom: "small" }}>{`Farm ${symbol}`}</CardHeader>
            <CardBody>
              <Form validate="change">
                <FormField
                  name="farmInput"
                  validate={[validateIsPositive(farmInput), validateIsLargerThanMax(farmInput, tokenBalance)]}
                >
                  <TextInput
                    value={farmInput}
                    onChange={handleFarmInputChange}
                    type="text"
                    placeholder={"0 " + symbol}
                  />
                  <AmountInputFooter
                    label={`Balance: ${utils.formatEther(tokenBalance?.toString() || "0")} ${symbol}`}
                    onClick={maxDeposit}
                  />
                </FormField>
              </Form>
            </CardBody>
            <CardFooter align="center" justify="center" pad={{ top: "medium" }}>
              <Box justify="center" gap="small">
                <ApproveToken
                  symbol={symbol}
                  spender={addresses[name].tenderFarm}
                  token={contracts[name].lpToken}
                  show={!isTokenApproved}
                />
                <Button
                  primary
                  disabled={
                    !isTokenApproved || !farmInput || farmInput.toString() === "0" || farmTx.status === "Mining"
                  }
                  onClick={farmLpTokens}
                  label={farmTx.status === "Mining" ? <LoadingButtonContent label="Farming..." /> : "Farm"}
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
