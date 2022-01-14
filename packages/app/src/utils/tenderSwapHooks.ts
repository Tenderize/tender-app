import { useContractCall } from "@usedapp/core";
import { abis } from "@tender/contracts";
import { BigNumber, constants, utils } from "ethers";

export const useCalculateLpTokenAmount = (pool: string, amounts: BigNumber[], deposit: boolean) => {
  return (
    useContractCall({
      abi: new utils.Interface(abis.tenderSwap),
      address: pool,
      method: "calculateTokenAmount",
      args: [amounts, deposit],
    }) ?? [constants.Zero]
  );
};

export const useCalculateSwap = (pool: string, tokenFrom: string, amount: BigNumber) => {
  return (
    useContractCall({
      abi: new utils.Interface(abis.tenderSwap),
      address: pool,
      method: "calculateSwap",
      args: [tokenFrom, amount],
    }) ?? [constants.Zero]
  );
};
