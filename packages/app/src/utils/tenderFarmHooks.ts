import { useContractFunction, useEthers } from "@usedapp/core";
import { contracts, addresses } from "@tender/contracts/src/index";
import { BigNumber } from "ethers";
import { getDeadline } from "./tenderSwapHooks";
import { signERC2612PermitPatched } from "./signERC2612PermitPatch";
import { ProtocolName } from "@tender/shared/src/data/stakers";
import { useIsGnosisSafe } from "./context";

export const useFarm = (owner: string | undefined | null, protocolName: ProtocolName, symbol: string) => {
  const isSafe = useIsGnosisSafe();
  // Contract Functions
  const { state: farmTx, send } = useContractFunction(
    contracts[protocolName].tenderFarm,
    isSafe ? "farm" : "farmWithPermit",
    {
      transactionName: `Farm ${symbol}`,
    }
  );
  const { library } = useEthers();

  const farm = async (farmAmount: BigNumber) => {
    // Since SWAP tokens have permit support by default we don't need to check if the token supports it
    // We need to check however whether we are using a gnosis safe context or not.
    if (isSafe) {
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
