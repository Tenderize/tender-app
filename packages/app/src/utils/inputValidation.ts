import { BigNumberish, utils } from "ethers";
import { useEffect, useState } from "react";

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

export const hasValue = (val: BigNumberish) => val != null && val !== "0";

export const useBalanceValidation = (input: string, balance: BigNumberish, extraDep?: string) => {
  const [validationMessage, setValidationMessage] = useState<string>();

  useEffect(() => {
    if (input !== "") {
      const isPos = isPositive(input);
      const isLTMax = isLargerThanMax(input, balance);

      if (!isPos) {
        setValidationMessage("Please provide a valid amount");
      } else if (isLTMax) {
        setValidationMessage("Amount exceeds available balance");
      } else {
        setValidationMessage(undefined);
      }
    }
  }, [input, balance, extraDep]);

  return { validationMessage };
};
