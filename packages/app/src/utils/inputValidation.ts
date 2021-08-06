import { BigNumberish, utils } from "ethers";

export const isPositiveAndSmallerThanMax = (val: string, max: BigNumberish): boolean =>
  val === "" || utils.parseEther(val).isNegative() || utils.parseEther(val).isZero() || utils.parseEther(val).gt(max);
