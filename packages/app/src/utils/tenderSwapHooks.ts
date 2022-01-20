import { useContractCall } from "@usedapp/core";
import { abis } from "@tender/contracts";
import { BigNumber, constants, utils } from "ethers";

const TenderSwapABI = new utils.Interface(abis.tenderSwap);

export const useCalculateLpTokenAmount = (pool: string, amounts: BigNumber[], deposit: boolean) => {
  const [tokens]: BigNumber[] = useContractCall(
    pool &&
      amounts.length === 2 &&
      amounts[0] &&
      amounts[1] && {
        abi: TenderSwapABI,
        address: pool,
        method: "calculateTokenAmount",
        args: [amounts, deposit],
      }
  ) ?? [constants.Zero];
  return tokens.mul(999).div(1000);
};

export const useCalculateRemoveLiquidity = (pool: string, amount: BigNumber) => {
  const [values] = useContractCall(
    pool &&
      amount &&
      !amount.isZero() && {
        abi: TenderSwapABI,
        address: pool,
        method: "calculateRemoveLiquidity",
        args: [amount],
      }
  ) ?? [[constants.Zero, constants.Zero]];

  return values;
};

export const useCalculateRemoveLiquidityOneToken = (pool: string, amount: BigNumber, tokenReceive: string) => {
  const [tokens]: BigNumber[] = useContractCall(
    pool &&
      amount &&
      !amount.isZero() &&
      tokenReceive && {
        abi: TenderSwapABI,
        address: pool,
        method: "calculateRemoveLiquidityOneToken",
        args: [amount, tokenReceive],
      }
  ) ?? [constants.Zero];

  return tokens;
};

export const useCalculateSwap = (pool: string, tokenFrom: string, amount: BigNumber) => {
  const [tokens]: BigNumber[] = useContractCall(
    pool &&
      tokenFrom &&
      amount &&
      !amount.isZero() && {
        abi: TenderSwapABI,
        address: pool,
        method: "calculateSwap",
        args: [tokenFrom, amount],
      }
  ) ?? [constants.Zero];
  return tokens;
};

export const getDeadline = () => {
  const DEADLINE_MINUTES = 10;
  const deadlineMS = new Date().getTime() + DEADLINE_MINUTES * 60000;
  return Math.floor(deadlineMS / 1000);
};
