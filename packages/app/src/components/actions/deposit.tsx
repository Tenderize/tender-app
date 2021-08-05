import { FC, useEffect, useState } from "react";
import { contracts, addresses } from "@tender/contracts";
import { useContractFunction, useEthers } from "@usedapp/core";
import { BigNumberish, utils } from "ethers";
import { Button, Box, Form, FormField, TextInput } from "grommet";
import { useQuery } from "@apollo/client";
import ApproveToken from "../approve/ApproveToken";
import { useIsTokenApproved } from "../approve/useIsTokenApproved";
import InfoCard from "../tenderizers/infocard";
import { GetUserDeployments } from "../../pages/token/queries";
import { weiToEthWithDecimals } from "../../utils/amountFormat";
import { AmountInputFooter } from "../AmountInputFooter";
import { ButtonSpinner } from "../ButtonSpinner";

type Props = {
  name: string;
  symbol: string;
  tokenBalance: BigNumberish;
  tenderTokenBalance: BigNumberish
};

const Deposit: FC<Props> = ({ name, symbol, tokenBalance, tenderTokenBalance }) => {
  const [depositInput, setDepositInput] = useState("");
  const { account } = useEthers();

  const subgraphName = name.charAt(0).toUpperCase() + name.slice(1)
  const { data, refetch } = useQuery(GetUserDeployments, {
    variables: { id: `${account?.toLowerCase()}_${subgraphName}` },
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
            title={`Available ${symbol}`}
            text={`${weiToEthWithDecimals(tokenBalance ?? "0", 3)} ${symbol}`}
          />
        </Box>
        <Box>
          <InfoCard
            title={`My Staked ${symbol}`}
            text={`${weiToEthWithDecimals(data?.userDeployments?.[0]?.tenderizerStake ?? "0", 3)} ${symbol}`}
          />
        </Box>
        <Box>
          <InfoCard
            title={"My TenderTokens"}
            text={`${weiToEthWithDecimals(tenderTokenBalance ?? "0", 3)} tender${symbol}`}
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
            />
            <AmountInputFooter
              label={`Balance: ${utils.formatEther(tokenBalance?.toString() || "0")} ${symbol}`}
              onClick={maxDeposit}
            />
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
                  <Box direction="row" align="center" justify="center" gap="small">
                    <ButtonSpinner />
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
