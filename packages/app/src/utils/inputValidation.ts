import { BigNumberish, utils } from "ethers";

type ValidateFunction = () => { message: string; status: "error" | "info" } | undefined;

export const isPositive = (val: string): boolean =>
  val !== "" && !utils.parseEther(val).isNegative() && !utils.parseEther(val).isZero();

export const isLargerThanMax = (val: string, max: BigNumberish): boolean => utils.parseEther(val).gt(max);

export const validateIsPositive =
  (val: string): ValidateFunction =>
  () =>
    !isPositive(val) ? { message: "Please provide a valid amount", status: "error" } : undefined;

export const validateIsLargerThanMax =
  (val: string, max: BigNumberish): ValidateFunction =>
  () =>
    isLargerThanMax(val, max) ? { message: "Amount exceeds available balance", status: "error" } : undefined;
