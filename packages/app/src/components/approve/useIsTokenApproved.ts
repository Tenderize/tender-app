import { useCall } from "@usedapp/core";
import { Contract, utils, constants, BigNumber } from "ethers";
import { abis } from "@tender/contracts/src/index";
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
        spenderAddress && {
          contract,
          method: "allowance",
          args: [ownerAddress, spenderAddress],
        }
    ) ?? {};
  const amountWei = utils.parseEther(amount || "0");
  const allowanceParsed: BigNumber = allowance?.[0] || constants.Zero;
  return amountWei ? amountWei.lte(allowanceParsed) : !allowanceParsed.isZero();
};
