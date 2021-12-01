import { BigNumberish, utils } from "ethers";

export const weiToEth = (amount: BigNumberish): string => {
  return utils.formatEther(amount.toString()) ?? "0";
};

export const weiToEthWithDecimals = (amount: BigNumberish, numberOfDecimals: number): string => {
  const str = weiToEth(amount);
  return ethWithDecimals(str, numberOfDecimals);
};

export const ethWithDecimals = (amount: string, numberOfDecimals: number): string => {
  if (amount.includes(".")) {
    const parts = amount.split(".");
    return parts[0] + "." + parts[1].slice(0, numberOfDecimals);
  }
  return amount;
};
