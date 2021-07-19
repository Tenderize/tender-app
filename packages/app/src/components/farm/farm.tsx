import { FC, useState } from "react";
// import { useContractFunction } from "@usedapp/core";
import { addresses, contracts } from "@tender/contracts";
import { BigNumber, BigNumberish, utils } from "ethers";
import { useContractFunction } from "@usedapp/core";
import ApproveToken from "../approve/ApproveToken";
import { useIsTokenApproved } from "../approve/useIsTokenApproved";
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

type Props = {
  name: string;
  symbol: string;
  tokenBalance: BigNumberish;
  tokenAllowance: BigNumberish;
};

const Farm: FC<Props> = ({ name, symbol, tokenBalance, tokenAllowance }) => {
  // Component state & helpers

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [farmInput, setFarmInput] = useState("");
  const handleFarmInputChange = (e: any) => {
    const val = e.target.value;
    if (val && !val.match(/^(\d+\.?\d*|\.\d+)$/)) return;
    setFarmInput(val);
  };

  const maxDeposit = () => {
    setFarmInput(utils.formatEther(tokenBalance || "0"));
  };

  const isTokenapproved = useIsTokenApproved(addresses[name].liquidity, addresses[name].farm, farmInput);

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
      <Button fill="horizontal" secondary onClick={handleShow} label="Farm" />
      {show && (
        <Layer onEsc={() => setShow(false)} onClickOutside={() => setShow(false)}>
          <Card>
            <CardHeader>{`Farm ${symbol}`}</CardHeader>
            <CardBody>
              <Form>
                <FormField>
                  <TextInput
                    width={1}
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
            <CardFooter>
              <ApproveToken
                symbol={symbol}
                spender={addresses[name].farm}
                token={contracts[name].liquidity}
                hasAllowance={isTokenapproved}
              />
              <Button
                secondary
                disabled={!isTokenapproved || !farmInput || farmInput.toString() === "0" || farmTx.status === "Mining"}
                onClick={farmLpTokens}
              >
                {farmTx.status === "Mining" ? (
                  <Box direction="row">
                    <Spinner color="white" />
                    Farming...
                  </Box>
                ) : (
                  "Farm"
                )}
              </Button>
            </CardFooter>
          </Card>
        </Layer>
      )}
    </>
  );
};

export default Farm;
