import { BigNumberish, utils } from "ethers";

export const weiToEth = (amount: BigNumberish): string => {
  return utils.formatEther(amount.toString()) ?? "0";
};

export const weiToEthInFloat = (amount: BigNumberish): number => {
  return Number.parseFloat(weiToEth(amount));
};

export const weiToEthWithDecimals = (amount: BigNumberish, numberOfDecimals: number): string => {
  const str = weiToEth(amount);
  return withDecimals(str, numberOfDecimals);
};

export const withDecimals = (amount: string, numberOfDecimals: number): string => {
  if (amount.includes(".")) {
    const parts = amount.split(".");
    return parts[0] + "." + parts[1].slice(0, numberOfDecimals);
  }
  return amount;
};
