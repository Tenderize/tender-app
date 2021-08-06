import { useEthers, useTokenAllowance } from "@usedapp/core";
import { utils } from "ethers";

export const useIsTokenApproved = (tokenAddress: string, spenderAddress: string, amount: string): boolean => {
  const { account } = useEthers();
  const allowance = useTokenAllowance(tokenAddress, account, spenderAddress);
  const isTokenApproved = allowance != null && allowance.gt(amount === "" ? "0" : utils.parseEther(amount));

  return isTokenApproved;
};
