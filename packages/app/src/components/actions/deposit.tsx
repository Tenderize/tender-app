import { FC, useEffect, useState } from "react";
import { contracts, addresses } from "@tender/contracts";
import { useContractFunction, useEthers } from "@usedapp/core";
import { BigNumberish, utils } from "ethers";
import { Button, Box, Form, FormField, TextInput, Spinner, Text } from "grommet";
import { useQuery } from "@apollo/client";
import ApproveToken from "../approve/ApproveToken";
import { useIsTokenApproved } from "../approve/useIsTokenApproved";
import InfoCard from "../tenderizers/infocard";
import { GetUserDeployments } from "../../pages/token/queries";
import { weiToEthWithDecimals } from "../../utils/amountFormat";

type Props = {
  name: string;
  symbol: string;
  tokenBalance: BigNumberish;
};

const Deposit: FC<Props> = ({ name, symbol, tokenBalance }) => {
  const [depositInput, setDepositInput] = useState("");
  const { account } = useEthers();

  const { data, refetch } = useQuery(GetUserDeployments, {
    variables: { id: `${account?.toLowerCase()}_${name}` },
  });

  // update my stake when tokenBalance changes
  useEffect(() => {
    refetch();
  }, [refetch, tokenBalance]);

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
    <Box gap="medium">
      <Box justify="around" direction="row">
        <Box>
          <InfoCard
            title={`${symbol} Balance`}
            text={`${utils.formatEther(tokenBalance?.toString() || "0")} ${symbol}`}
          />
        </Box>
        <Box>
          <InfoCard
            title={"My Stake"}
            // TODO this should update when depositing funds (moving from left to right column)
            text={`${weiToEthWithDecimals(data?.userDeployments?.[0]?.tenderizerStake ?? "0", 4)} tender${symbol}`}
          />
        </Box>
        <Box>
          <InfoCard
            title={"My Rewards"}
            text={`${weiToEthWithDecimals(data?.userDeployments?.[0]?.farmHarvest ?? "0", 4)} tender${symbol}`}
          />
        </Box>
      </Box>

      <Box fill="horizontal" direction="row" justify="center" align="center">
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
              <Button plain onClick={maxDeposit}>
                <Text color="brand">(Max)</Text>
              </Button>
            </Box>
          </FormField>
          <Box gap="small" direction="column">
            <ApproveToken
              symbol={symbol}
              spender={addresses[name].controller}
              token={contracts[name].token}
              show={!isTokenApproved}
            />
            <Button
              primary
              fill="horizontal"
              disabled={
                !isTokenApproved || !depositInput || depositInput.toString() === "0" || depositTx.status === "Mining"
              }
              onClick={depositTokens}
              label={
                depositTx.status === "Mining" ? (
                  <Box direction="row" align="center" justify="center" gap="center">
                    <Spinner color="white" />
                    Depositing...
                  </Box>
                ) : (
                  "Deposit"
                )
              }
            />
          </Box>
        </Form>
      </Box>
    </Box>
  );
};

export default Deposit;
