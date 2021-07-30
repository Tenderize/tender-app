import { BigNumberish, utils } from "ethers";

export const weiToEth = (amount: BigNumberish): string => {
  return utils.formatEther(amount.toString()) ?? "0";
};

export const weiToEthWithDecimals = (amount: BigNumberish, numberOfDecimals: number): string => {
  const str = weiToEth(amount);
  if (str.includes(".")) {
    const parts = str.split(".");
    return parts[0] + "." + parts[1].slice(0, numberOfDecimals);
  }
  return str;
};
