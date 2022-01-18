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

export const useCalculateRemoveLiquidity = (pool: string, amount: BigNumber) => {
  return (
    useContractCall({
      abi: new utils.Interface(abis.tenderSwap),
      address: pool,
      method: "calculateRemoveLiquidity",
      args: [amount],
    }) ?? [constants.Zero]
  );
};

export const useCalculateRemoveLiquidityOneToken = (pool: string, amount: BigNumber, tokenReceive: string) => {
  return (
    useContractCall({
      abi: new utils.Interface(abis.tenderSwap),
      address: pool,
      method: "calculateRemoveLiquidityOneToken",
      args: [amount, tokenReceive],
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

export const getDeadline = () => {
  const DEADLINE_MINUTES = 10;
  const deadlineMS = new Date().getTime() + DEADLINE_MINUTES * 60000;
  return Math.floor(deadlineMS / 1000);
};
