import { FC, useEffect, useRef, useState } from "react";
import { contracts, addresses } from "@tender/contracts";
import { useEthers } from "@usedapp/core";
import { BigNumber, BigNumberish, utils, constants } from "ethers";
import { Button, Box, Form, FormField, Image, Text, TextInput } from "grommet";
import { useQuery } from "@apollo/client";
import ApproveToken from "../approve/ApproveToken";
import { useIsTokenApproved } from "../approve/useIsTokenApproved";
import InfoCard from "../tenderizers/infocard";
import { GetUserDeployments, UserDeploymentsType } from "../../pages/token/queries";
import { weiToEthWithDecimals } from "../../utils/amountFormat";
import { AmountInputFooter } from "../AmountInputFooter";
import { ButtonSpinner } from "../ButtonSpinner";
import { validateIsLargerThanMax, validateIsPositive } from "../../utils/inputValidation";
import { useContractFunction } from "../../utils/useDappPatch";

type Props = {
  name: string;
  symbol: string;
  logo: string;
  tokenBalance: BigNumberish;
  tenderTokenBalance: BigNumberish;
};

const Deposit: FC<Props> = ({ name, symbol, logo, tokenBalance, tenderTokenBalance }) => {
  const logoImg = require("../../images/" + logo);
  const [depositInput, setDepositInput] = useState("");
  const { account } = useEthers();

  const subgraphName = name.charAt(0).toUpperCase() + name.slice(1);
  const { data, refetch } = useQuery<UserDeploymentsType>(GetUserDeployments, {
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

  const claimedRewards = BigNumber.from(data?.userDeployments?.[0]?.claimedRewards ?? "0");
  const tenderizerStake = BigNumber.from(data?.userDeployments?.[0]?.tenderizerStake ?? "0");
  const tenderTokenBalanceRef = useRef(tenderTokenBalance);
  const [nonNegativeRewards, setNonNegativeRewards] = useState(BigNumber.from("0"));

  useEffect(() => {
    if (!BigNumber.from(tenderTokenBalance).eq(BigNumber.from(tenderTokenBalanceRef.current))) {
      tenderTokenBalanceRef.current = tenderTokenBalance;
      const myRewards = claimedRewards.add(tenderTokenBalance).sub(tenderizerStake);
      setNonNegativeRewards(myRewards.isNegative() ? constants.Zero : myRewards);
    }
  }, [claimedRewards, data?.userDeployments, tenderTokenBalance, tenderizerStake]);

  return (
    <>
      <Box gap="medium">
        <Box justify="around" direction="row">
          <Box>
            <InfoCard
              title={`Staked ${symbol}`}
              text={`${weiToEthWithDecimals(data?.userDeployments?.[0]?.tenderizerStake ?? "0", 3)} ${symbol}`}
            />
          </Box>
          <Box>
            <InfoCard
              title={"Tender Token Balance"}
              text={`${weiToEthWithDecimals(tenderTokenBalance ?? "0", 3)} tender${symbol}`}
            />
          </Box>
          <Box>
            <InfoCard title={`Rewards`} text={`${weiToEthWithDecimals(nonNegativeRewards ?? "0", 3)} ${symbol}`} />
          </Box>
        </Box>
      </Box>

      <Box direction="row" justify="center" align="center">
        <Form validate="change">
          <Box align="center" justify="center">
            <Box width="470px" gap="small" direction="column">
              <FormField
                fill
                label="Deposit Amount"
                name="depositAmount"
                validate={[validateIsPositive(depositInput), validateIsLargerThanMax(depositInput, tokenBalance)]}
              >
                <TextInput
                  value={depositInput}
                  onChange={handleInputChange}
                  type="text"
                  icon={
                    <Box pad="xsmall" direction="row" align="center" gap="small">
                      <Image height="35" src={logoImg.default} />
                      <Text>{symbol}</Text>
                    </Box>
                  }
                  style={{ textAlign: "right", padding: "20px 50px" }}
                  placeholder={`0`}
                />
                <AmountInputFooter
                  label={`Balance: ${utils.formatEther(tokenBalance?.toString() || "0")} ${symbol}`}
                  onClick={maxDeposit}
                />
              </FormField>
              <Box gap="small" direction="column" width="470px">
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
                    !isTokenApproved ||
                    !depositInput ||
                    depositInput.toString() === "0" ||
                    depositTx.status === "Mining"
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
            </Box>
          </Box>
        </Form>
      </Box>
    </>
  );
};

export default Deposit;
