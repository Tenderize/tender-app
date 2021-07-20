import { contracts, addresses } from "@tender/contracts";
import { useContractFunction } from "@usedapp/core";
import { BigNumberish, utils } from "ethers";
import { FC, useState } from "react";
import ApproveToken from "../approve/ApproveToken";
import { useIsTokenApproved } from "../approve/useIsTokenApproved";
import InfoCard from "../tenderizers/infocard";
import { Button, Box, Grid, Form, FormField, TextInput, Spinner, Text } from "grommet";

type Props = {
  name: string;
  symbol: string;
  tokenBalance: BigNumberish;
  tokenAllowance: BigNumberish;
};

const Deposit: FC<Props> = ({ name, symbol, tokenBalance, tokenAllowance }) => {
  const [depositInput, setDepositInput] = useState("");

  const maxDeposit = () => {
    setDepositInput(utils.formatEther(tokenBalance.toString()));
  };

  const handleInputChange = (e: any) => {
    const val = e.target.value;
    if (val && !val.match(/^(\d+\.?\d*|\.\d+)$/)) return;
    setDepositInput(val);
  };

  const { state: depositTx, send: deposit } = useContractFunction(contracts[name].controller, "deposit", {
    transactionName: `Deposit ${symbol}`,
  });

  const depositTokens = async (e: any) => {
    e.preventDefault();
    await deposit(utils.parseEther(depositInput || "0"));
    setDepositInput("");
  };

  const isTokenApproved = useIsTokenApproved(addresses[name].token, addresses[name].controller, depositInput);

  return (
    <>
      <Grid fill rows={["1/2", "1/2"]}>
        <Box flex fill="horizontal" direction="row" justify="center" pad="medium">
          <InfoCard
            title={`${symbol} Balance`}
            text={`${utils.formatEther(tokenBalance?.toString() || "0")} ${symbol}`}
          />
          <InfoCard title={"My Stake"} text={`0.00 tender${symbol}`} />
          <InfoCard title={"My Rewards"} text={`0.00 tender${symbol}`} />
        </Box>

        <Box fill="horizontal" direction="row" justify="center" align="center" pad={{ horizontal: "xlarge" }}>
          <Form>
            <FormField label="Deposit Amount" controlId="formDeposit">
              <TextInput
                width={1}
                value={depositInput}
                onChange={handleInputChange}
                type="text"
                placeholder={"0 " + symbol}
                className="amount"
              />
              <Box direction="row" gap="small">
                <Text>{`Balance: ${utils.formatEther(tokenBalance?.toString() || "0")} ${symbol}`}</Text>
                <Button
                  plain
                  onClick={maxDeposit}
                >
                  <Text color="brand">(Max)</Text>
                </Button>
              </Box>
            </FormField>
            <Box gap="small" direction="column">
              <ApproveToken
                symbol={symbol}
                spender={addresses[name].controller}
                token={contracts[name].token}
                hasAllowance={isTokenApproved}
              />
              <Button
                primary
                color="brand"
                fill="horizontal"
                disabled={
                  !isTokenApproved || !depositInput || depositInput.toString() === "0" || depositTx.status === "Mining"
                }
                onClick={depositTokens}
                label={depositTx.status === "Mining" ? (
                  <Box direction="row" align="center" justify="center" gap="center">
                    <Spinner color="white" />
                    Depositing...
                  </Box>
                ) : (
                  "Deposit"
                )}
              />
            </Box>
          </Form>
        </Box>
      </Grid>
    </>
  );
};

export default Deposit;
