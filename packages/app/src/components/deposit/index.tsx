import { FC, MouseEventHandler, useState } from "react";
import { addresses, contracts } from "@tender/contracts/src/index";
import { useIsGnosisSafe } from "utils/context";
import { useEthers } from "@usedapp/core";
import { BigNumber, BigNumberish, utils } from "ethers";
import { Button, Box, Form, FormField, Image, Text, TextInput } from "grommet";
import ApproveToken from "components/approve/ApproveToken";
import { useIsTokenApproved } from "components/approve/useIsTokenApproved";
import { InfoCard, stakers } from "@tender/shared/src/index";
import { AmountInputFooter } from "components/AmountInputFooter";
import { LoadingButtonContent } from "components/LoadingButtonContent";
import { weiToEthWithDecimals } from "utils/amountFormat";
import { isPendingTransaction } from "utils/transactions";
import { isLargerThanMax, isPositive, useBalanceValidation } from "utils/inputValidation";
import { useDeposit } from "utils/tenderDepositHooks";
import { useResetInputAfterTx } from "utils/useResetInputAfterTx";
import { ProtocolName } from "@tender/shared/src/data/stakers";
import ConfirmDepositModal from "./ConfirmDepositModal";
import ChangeChainWarning from "components/ChangeChainWarning";
import UnstakeModal from "./UnstakeModal";
import WithdrawModal from "./WithdrawModal";
import Faucet from "components/faucet";
import { useLocks } from "utils/useUnstakeEvents";
import { useAPY } from "utils/useAPY";
import { useRewards } from "utils/useRewards";

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
  const [showUnstake, setShowUnstake] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const hasPermit = stakers[protocolName].hasPermit;

  const { locks } = useLocks(stakers[protocolName]);
  const { apy } = useAPY(stakers[protocolName]);
  const { rewards } = useRewards(stakers[protocolName], tokenBalance, tenderTokenBalance);
  const isSafeContext = useIsGnosisSafe();

  const maxDeposit = () => {
    setDepositInput(utils.formatEther(tokenBalance.toString()));
  };

  const { tx: depositTx, deposit } = useDeposit(protocolName);

  useResetInputAfterTx(depositTx, setDepositInput);

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
            <InfoCard title={`Rewards`} text={`${weiToEthWithDecimals(rewards ?? "0", 3)} t${symbol}`} />
          </Box>
        </Box>
      </Box>
      <Box justify="center" align="center">
        <ChangeChainWarning protocolName={protocolName}>
          <Form>
            <Box align="center" justify="center">
              <Box width="490px" gap="small" direction="column">
                <FormField fill label="Stake Amount" name="depositAmount">
                  <TextInput
                    value={depositInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val && !val.match(/^(\d+\.?\d*|\.\d+)$/)) return;
                      setDepositInput(val);
                    }}
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
                {BigNumber.from(tenderTokenBalance).gt(0) && (
                  <Button secondary fill="horizontal" label="Unstake" onClick={() => setShowUnstake(true)} />
                )}
                {locks.length > 0 && (
                  <Button secondary fill="horizontal" label="Withdraw" onClick={() => setShowWithdraw(true)} />
                )}
              </Box>
            </Box>
          </Form>
        </ChangeChainWarning>
        <Faucet symbol={symbol} protocolName={protocolName} />
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
      <UnstakeModal
        show={showUnstake}
        protocolName={protocolName}
        tenderTokenBalance={tenderTokenBalance}
        onDismiss={() => setShowUnstake(false)}
      />
      <WithdrawModal
        show={showWithdraw}
        protocolName={protocolName}
        locks={locks}
        onDismiss={() => setShowWithdraw(false)}
      />
    </Box>
  );
};

export default Deposit;
