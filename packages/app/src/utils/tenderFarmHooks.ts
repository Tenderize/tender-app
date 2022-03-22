import { useContractFunction, useEthers } from "@usedapp/core";
import { contracts, addresses } from "@tender/contracts/src";
import { BigNumber } from "ethers";
import { signERC2612Permit } from "eth-permit";
import { getDeadline } from "./tenderSwapHooks";

export const useFarm = (
  owner: string | undefined | null,
  protocolName: string,
  symbol: string,
  isLpTokenApproved: boolean
) => {
  // Contract Functions
  const { state: farmTx, send } = useContractFunction(
    contracts[protocolName].tenderFarm,
    isLpTokenApproved ? "farm" : "farmWithPermit",
    {
      transactionName: `Farm ${symbol}`,
    }
  );
  const { library } = useEthers();

  const farm = async (farmAmount: BigNumber) => {
    if (isLpTokenApproved) {
      await send(farmAmount);
    } else {
      const permit = await signERC2612Permit(
        library?.getSigner(),
        addresses[protocolName].lpToken,
        owner ?? "",
        addresses[protocolName].tenderFarm,
        farmAmount.toString(),
        getDeadline()
      );
      await send(farmAmount.toString(), permit.deadline, permit.v, permit.r, permit.s);
    }
  };

  return { farmTx, farm };
};
