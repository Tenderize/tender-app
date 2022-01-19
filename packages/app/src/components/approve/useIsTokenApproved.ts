import { useContractCall } from "@usedapp/core";
import { constants, utils } from "ethers";
import { abis } from "@tender/contracts";

export const useIsTokenApproved = (tokenAddress: string, ownerAddress: string, spenderAddress: string, amount: string): boolean => {
   const [allowance] =
  useContractCall(
    tokenAddress &&
    ownerAddress &&
    spenderAddress &&
    amount &&
    {
        abi: new utils.Interface(abis.token),
        address: tokenAddress,
        method: 'allowance',
        args: [ownerAddress, spenderAddress],
      }
  ) ?? [constants.Zero]
  const amountWei = utils.parseEther(amount || "0")
 return allowance.gte(amountWei);


};
