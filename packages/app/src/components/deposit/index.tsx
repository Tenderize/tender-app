import { FC, MouseEventHandler, useEffect, useState } from "react";
import { addresses, contracts } from "@tender/contracts/src/index";
import { useIsGnosisSafe } from "utils/context";
import { useEthers } from "@usedapp/core";
import { BigNumber, BigNumberish, utils, constants } from "ethers";
import { Button, Box, Form, FormField, Image, Text, TextInput } from "grommet";
import { useQuery } from "@apollo/client";
import ApproveToken from "components/approve/ApproveToken";
import { useIsTokenApproved } from "components/approve/useIsTokenApproved";
import { getUnixTimestampQuarter, InfoCard, Queries, stakers, calculateAPY } from "@tender/shared/src/index";
import { AmountInputFooter } from "components/AmountInputFooter";
import { LoadingButtonContent } from "components/LoadingButtonContent";
import { weiToEthWithDecimals } from "utils/amountFormat";
import { isPendingTransaction } from "utils/transactions";
import { isLargerThanMax, isPositive, useBalanceValidation } from "utils/inputValidation";
import { useIsCorrectChain } from "utils/useEnsureRinkebyConnect";
import { SwitchNetwork } from "components/account/SwitchNetwork";
import { useDeposit } from "utils/tenderDepositHooks";
import { useResetInputAfterTx } from "utils/useResetInputAfterTx";
import { ProtocolName } from "@tender/shared/src/data/stakers";
import ConfirmDepositModal from "./ConfirmDepositModal";

type Props = {
  protocolName: ProtocolName;
  symbol: string;
  logo: string;
  tokenBalance: BigNumberish;
  tenderTokenBalance: BigNumberish;
};

const Deposit: FC<Props> = ({ protocolName, symbol, logo, tokenBalance, tenderTokenBalance }) => {
  const { account } = useEthers();
  const [depositInput, setDepositInput] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const requiredChain = stakers[protocolName].chainId;
  const hasPermit = stakers[protocolName].hasPermit;
  const subgraphName = stakers[protocolName].subgraphId;

  const { data, refetch } = useQuery<Queries.UserDeployments>(Queries.GetUserDeployments, {
    variables: { id: `${account?.toLowerCase()}_${subgraphName}` },
    context: { chainId: requiredChain },
  });

  const { data: apyData, refetch: refetchAPY } = useQuery<Queries.TenderizerDaysType>(Queries.GetTenderizerDays, {
    query: Queries.GetTenderizerDays,
    variables: { from: getUnixTimestampQuarter() },
    context: { chainId: requiredChain },
  });

  const protocolAPYs = Object.values(calculateAPY(apyData));
  const apy = protocolAPYs.find((staker) => staker.subgraphId === stakers[protocolName].subgraphId)?.apy ?? "";

  // update my stake when tokenBalance changes
  useEffect(() => {
    refetch();
  }, [refetch, tokenBalance]);

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

  const depositTokens: MouseEventHandler<HTMLElement> = async (e) => {
    e.preventDefault();
    await deposit(utils.parseEther(depositInput || "0"), isSafeContext);
    setDepositInput("");
    setShowConfirm(false);
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
                    onClick={() => setShowConfirm(true)}
                    label={isPendingTransaction(depositTx) ? <LoadingButtonContent label="Staking..." /> : "Stake"}
                  />
                </Box>
              </Box>
            </Box>
          </Form>
        )}
      </Box>
      <ConfirmDepositModal
        show={showConfirm}
        onDismiss={() => {
          setShowConfirm(false);
          setDepositInput("");
        }}
        tokenBalance={tokenBalance}
        tenderTokenBalance={tenderTokenBalance}
        tokenAmount={depositInput}
        setTokenAmount={setDepositInput}
        protocolName={protocolName}
        deposit={depositTokens}
        tx={depositTx}
      />
    </Box>
  );
};

export default Deposit;
