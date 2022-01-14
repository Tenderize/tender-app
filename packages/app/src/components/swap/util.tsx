import { useContractCall } from "@usedapp/core";
import { abis } from "@tender/contracts";
import { BigNumber } from "ethers";

export function calculateTokenAmount(
    pool: string,
    amounts: BigNumber[],
    deposit: boolean
) {
    return useContractCall({
        abi: abis.tenderSwap.interface,
        address: pool,
        method: "calculateTokenAmount",
        args: [
          amounts,
          deposit
        ],
      }) ?? []
}

export function calculateSwap(
  pool: string,
  tokenFrom: string,
  amount: BigNumber
) {
  return useContractCall({
    abi: abis.tenderSwap.interface,
    address: pool,
    method: "calculateSwap",
    args: [
      tokenFrom,
      amount
    ]
  }) ?? []
}