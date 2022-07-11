import { FC, useEffect, useState } from "react";
import { addresses, contracts } from "@tender/contracts/src/index";
import { useIsGnosisSafe } from "utils/context";
import { ArbitrumRinkeby, Rinkeby, useEthers } from "@usedapp/core";
import { BigNumber, BigNumberish, utils, constants } from "ethers";
import { Button, Box, Form, FormField, Image, Text, TextInput } from "grommet";
import { useQuery } from "@apollo/client";
import ApproveToken from "components/approve/ApproveToken";
import { useIsTokenApproved } from "components/approve/useIsTokenApproved";
import { getUnixTimestampMonthAgo, InfoCard, Queries, stakers, calculateAPY } from "@tender/shared/src/index";
import { AmountInputFooter } from "components/AmountInputFooter";
import { LoadingButtonContent } from "components/LoadingButtonContent";
import { weiToEthWithDecimals } from "utils/amountFormat";
import { isPendingTransaction } from "utils/transactions";
import { isLargerThanMax, isPositive, useBalanceValidation } from "utils/inputValidation";
import Faucet from "components/faucet";
import { useIsCorrectChain } from "utils/useEnsureRinkebyConnect";
import { SwitchNetwork } from "components/account/SwitchNetwork";
import { useDeposit } from "utils/tenderDepositHooks";
import { useResetInputAfterTx } from "utils/useResetInputAfterTx";
import { ProtocolName } from "@tender/shared/src/data/stakers";

type Props = {
  protocolName: ProtocolName;
  symbol: string;
  logo: string;
  tokenBalance: BigNumberish;
  tenderTokenBalance: BigNumberish;
};

const Deposit: FC<Props> = ({ protocolName, symbol, logo, tokenBalance, tenderTokenBalance }) => {
  const [depositInput, setDepositInput] = useState("");
  const { account, chainId } = useEthers();

  const requiredChain = stakers[protocolName].chainId;

  // whether supported asset (e.g. LPT) has ERC20 permit support
  const hasPermit = stakers[protocolName].hasPermit;

  const subgraphName = stakers[protocolName].subgraphId;
  const { data, refetch } = useQuery<Queries.UserDeployments>(Queries.GetUserDeployments, {
    variables: { id: `${account?.toLowerCase()}_${subgraphName}` },
    context: { chainId: requiredChain },
  });

  // update my stake when tokenBalance changes
  useEffect(() => {
    refetch();
  }, [refetch, tokenBalance]);

  const monthAgo = getUnixTimestampMonthAgo();

  const { data: apyData, refetch: refetchAPY } = useQuery<Queries.TenderizerDaysType>(Queries.GetTenderizerDays, {
    query: Queries.GetTenderizerDays,
    variables: { from: monthAgo },
    context: { chainId: requiredChain },
  });
  const { graph, livepeer, audius, matic } = calculateAPY(apyData);
  const stakersWithAPY = [graph, livepeer, audius, matic];
  const apy = stakersWithAPY.find((staker) => staker.subgraphId === stakers[protocolName].subgraphId)?.apy ?? "";

  // update my stake when chainId changes
  useEffect(() => {
    refetchAPY();
  }, [refetchAPY, requiredChain]);

  const maxDeposit = () => {
    setDepositInput(utils.formatEther(tokenBalance.toString()));
  };

  const isCorrectChain = useIsCorrectChain(requiredChain);

  const handleInputChange = (e: any) => {
    const val = e.target.value;
    if (val && !val.match(/^(\d+\.?\d*|\.\d+)$/)) return;
    setDepositInput(val);
  };

  const { tx: depositTx, deposit } = useDeposit(protocolName);

  useResetInputAfterTx(depositTx, setDepositInput);

  const isSafeContext = useIsGnosisSafe();

  const depositTokens = async (e: any) => {
    e.preventDefault();
    await deposit(utils.parseEther(depositInput || "0"), isSafeContext);
    setDepositInput("");
  };

  const isTokenApproved = useIsTokenApproved(
    addresses[protocolName].token,
    account,
    addresses[protocolName].tenderizer,
    depositInput
  );

  const { validationMessage } = useBalanceValidation(depositInput, tokenBalance);

  const claimedRewards = BigNumber.from(data?.userDeployments?.[0]?.claimedRewards ?? "0");
  const tenderizerStake = BigNumber.from(data?.userDeployments?.[0]?.tenderizerStake ?? "0");
  const myRewards = claimedRewards.add(tenderTokenBalance).sub(tenderizerStake);
  const nonNegativeRewards = myRewards.isNegative() ? constants.Zero : myRewards;

  return (
    <Box>
      <Box gap="medium" pad={{ bottom: "medium" }}>
        <Box justify="around" direction="row">
          <Box>
            <InfoCard title={`Current APY`} text={`${apy} %`} />
          </Box>
          <Box>
            <InfoCard
              title={`t${symbol} Balance`}
              text={`${weiToEthWithDecimals(tenderTokenBalance ?? "0", 3)} t${symbol}`}
            />
          </Box>
          <Box>
            <InfoCard title={`Rewards`} text={`${weiToEthWithDecimals(nonNegativeRewards ?? "0", 3)} t${symbol}`} />
          </Box>
        </Box>
      </Box>
      <Box justify="center" align="center">
        {!isCorrectChain && account ? (
          <Box pad={{ vertical: "large" }}>
            <SwitchNetwork chainId={requiredChain} protocol={stakers[protocolName].title} />
          </Box>
        ) : (
          <Form>
            <Box align="center" justify="center">
              <Box width="490px" gap="small" direction="column">
                <FormField fill label="Stake Amount" name="depositAmount">
                  <TextInput
                    value={depositInput}
                    onChange={handleInputChange}
                    type="number"
                    icon={
                      <Box pad="xsmall" direction="row" align="center" gap="small">
                        <Image height="35" src={`/${logo}`} />
                        <Text>{symbol}</Text>
                      </Box>
                    }
                    style={{ textAlign: "right", padding: "20px 50px" }}
                    placeholder={`0`}
                  />
                  <Text color="red">{validationMessage}</Text>
                  <AmountInputFooter
                    label={`Balance: ${weiToEthWithDecimals(tokenBalance?.toString() || "0", 6)} ${symbol}`}
                    onClick={maxDeposit}
                  />
                </FormField>
                <Box gap="small" direction="column">
                  <ApproveToken
                    symbol={symbol}
                    spender={addresses[protocolName].tenderizer}
                    token={contracts[protocolName].token}
                    show={(!hasPermit || isSafeContext) && !isTokenApproved}
                    chainId={stakers[protocolName].chainId}
                  />
                  <Button
                    primary
                    fill="horizontal"
                    disabled={
                      (!hasPermit && !isTokenApproved) ||
                      !depositInput ||
                      !isPositive(depositInput) ||
                      isLargerThanMax(depositInput, tokenBalance) ||
                      depositInput.toString() === "0" ||
                      isPendingTransaction(depositTx)
                    }
                    onClick={depositTokens}
                    label={isPendingTransaction(depositTx) ? <LoadingButtonContent label="Staking..." /> : "Stake"}
                  />
                </Box>
              </Box>
            </Box>
          </Form>
        )}
      </Box>
      {chainId === requiredChain && (chainId === Rinkeby.chainId || chainId === ArbitrumRinkeby.chainId) && (
        <Box
          margin={{ top: "medium" }}
          alignSelf="center"
          width="large"
          pad={{ horizontal: "large", top: "medium" }}
          border={{ side: "top" }}
          justify="center"
          align="center"
          direction="column"
          gap="medium"
        >
          <Text>Get Testnet Tokens</Text>
          <Faucet symbol={symbol} protocolName={protocolName} />
        </Box>
      )}
    </Box>
  );
};

export default Deposit;
