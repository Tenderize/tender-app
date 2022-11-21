import { useCall, useContractFunction, useEthers } from "@usedapp/core";
import { contracts, addresses } from "@tender/contracts/src/index";
import { BigNumber, constants } from "ethers";
import { stakers } from "@tender/shared/src/index";
import { getDeadline } from "./tenderSwapHooks";
import { hasPermit } from "./context";
import { signERC2612PermitPatched } from "./signERC2612PermitPatch";
import { ProtocolName } from "@tender/shared/src/data/stakers";

export const useDeposit = (protocolName: ProtocolName) => {
  const symbol = stakers[protocolName].symbol;

  const { state: depositTx, send: depositWithApprove } = useContractFunction(
    contracts[protocolName].tenderizer,
    "deposit",
    {
      transactionName: `Deposit ${symbol}`,
    }
  );

  const { state: depositWithPermitTx, send: depositWithPermit } = useContractFunction(
    contracts[protocolName].tenderizer,
    "depositWithPermit",
    {
      transactionName: `Deposit ${symbol}`,
    }
  );

  const { library, account } = useEthers();

  const deposit = async (amount: BigNumber, isSafeContext: boolean) => {
    if (!hasPermit(protocolName) || isSafeContext) {
      // TODO: We expect token to be already approved here but don't actually check such invariant
      await depositWithApprove(amount);
    } else {
      const permit = await signERC2612PermitPatched(
        library?.getSigner(),
        addresses[protocolName].token,
        account || "",
        addresses[protocolName].tenderizer,
        amount?.toString(),
        getDeadline()
      );

      await depositWithPermit(amount, permit.deadline, permit.v, permit.r, permit.s);
    }
  };

  return { deposit, tx: hasPermit(protocolName) ? depositWithPermitTx : depositTx };
};

export const useUnstake = (protocolName: ProtocolName) => {
  const symbol = stakers[protocolName].symbol;

  const { state: depositTx, send: unstake } = useContractFunction(contracts[protocolName].tenderizer, "unstake", {
    transactionName: `Unstake ${symbol}`,
  });

  return { unstake, tx: depositTx };
};

export const useWithdraw = (protocolName: ProtocolName) => {
  const symbol = stakers[protocolName].symbol;

  const { state: withdrawTx, send: withdraw } = useContractFunction(contracts[protocolName].tenderizer, "withdraw", {
    transactionName: `Withdraw ${symbol}`,
  });

  return { withdraw, tx: withdrawTx };
};

export const useCalcDepositOut = (protocolName: ProtocolName, amount: string) => {
  const result = useCall(
    protocolName && {
      contract: contracts[protocolName].tenderizer,
      method: "calcDepositOut",
      args: [amount],
    }
  );
  return result?.value?.[0] ?? constants.Zero;
};
