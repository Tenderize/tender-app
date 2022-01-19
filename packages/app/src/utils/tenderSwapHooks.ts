import { useContractCall } from "@usedapp/core";
import { abis } from "@tender/contracts";
import { BigNumber, constants, utils } from "ethers";

export const useCalculateLpTokenAmount = (pool: string, amounts: BigNumber[], deposit: boolean) => {
  return (
    useContractCall(
      pool && amounts.length === 2 && amounts[0] && amounts[1] && {
      abi: new utils.Interface(abis.tenderSwap),
      address: pool,
      method: "calculateTokenAmount",
      args: [amounts, deposit],
    }) ?? [constants.Zero]
  );
};

export const useCalculateRemoveLiquidity = (pool: string, amount: BigNumber) => {
  return (
    useContractCall(
      pool && amount && !amount.isZero && {
      abi: new utils.Interface(abis.tenderSwap),
      address: pool,
      method: "calculateRemoveLiquidity",
      args: [amount],
    }) ?? [constants.Zero, constants.Zero]
  );
};

export const useCalculateRemoveLiquidityOneToken = (pool: string, amount: BigNumber, tokenReceive: string) => {
  return (
    useContractCall( pool && amount && !amount.isZero && tokenReceive && {
      abi: new utils.Interface(abis.tenderSwap),
      address: pool,
      method: "calculateRemoveLiquidityOneToken",
      args: [amount, tokenReceive],
    }) ?? [constants.Zero]
  );
};

export const useCalculateSwap = (pool: string, tokenFrom: string, amount: BigNumber) => {
  return (
    useContractCall(
      pool && tokenFrom && amount && !amount.isZero() && {
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
