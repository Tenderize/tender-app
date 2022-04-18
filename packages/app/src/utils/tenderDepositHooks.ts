import { useContractFunction, useEthers } from "@usedapp/core";
import { contracts, addresses } from "@tender/contracts/src/index";
import { BigNumber } from "ethers";
import { signERC2612Permit } from "eth-permit";
import { stakers } from "@tender/shared/src/index";
import { getDeadline } from "./tenderSwapHooks";

export const useDeposit = (protocolName: string) => {
  const symbol = stakers[protocolName].symbol;
  const hasPermit = stakers[protocolName].hasPermit;

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

  const deposit = async (amount: BigNumber) => {
    if (hasPermit) {
      const permit = await signERC2612Permit(
        library?.getSigner(),
        addresses[protocolName].token,
        account || "",
        addresses[protocolName].tenderizer,
        amount?.toString(),
        getDeadline()
      );

      await depositWithPermit(amount, permit.deadline, permit.v, permit.r, permit.s);
    } else {
      await depositWithApprove(amount);
    }
  };

  return { deposit, tx: hasPermit ? depositWithPermitTx : depositTx };
};
