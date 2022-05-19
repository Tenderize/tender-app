import { useContractFunction, useEthers } from "@usedapp/core";
import { contracts, addresses } from "@tender/contracts/src/index";
import { BigNumber } from "ethers";
import { getDeadline } from "./tenderSwapHooks";
import { signERC2612PermitPatched } from "./signERC2612PermitPatch";

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
      const permit = await signERC2612PermitPatched(
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
