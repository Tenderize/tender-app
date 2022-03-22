import { useCall } from "@usedapp/core";
import { Contract, utils } from "ethers";
import { abis } from "@tender/contracts/src";
import { ERC20 } from "@tender/contracts/gen/types";

export const useIsTokenApproved = (
  tokenAddress: string,
  ownerAddress: string | null | undefined,
  spenderAddress: string,
  amount: string
): boolean => {
  const contract = new Contract(tokenAddress, new utils.Interface(abis.token)) as ERC20;

  const { value: allowance } =
    useCall(
      tokenAddress &&
        ownerAddress &&
        spenderAddress &&
        amount && {
          contract,
          method: "allowance",
          args: [ownerAddress, spenderAddress],
        }
    ) ?? {};

  const amountWei = utils.parseEther(amount || "0");
  return allowance?.[0].gte(amountWei) ?? false;
};
