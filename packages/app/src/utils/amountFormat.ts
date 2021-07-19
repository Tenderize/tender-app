import { BigNumberish, utils, BigNumber } from "ethers";

export const weiToEth = (amount: BigNumberish): string => {
  return utils.formatEther(amount.toString()) ?? "0";
};

export const weiToEthWithDecimals = (amount: BigNumberish, numberOfDecimals: number): string => {
  const str = utils.formatEther(amount.toString()) ?? "0";
  if (str.includes(".")) {
    const parts = str.split(".");
    return parts[0] + "." + parts[1].slice(0, numberOfDecimals);
  }
  return str;
};
