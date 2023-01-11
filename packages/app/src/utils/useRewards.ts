import { useQuery } from "@apollo/client";
import { Queries, Staker } from "@tender/shared/src";
import { useEthers } from "@usedapp/core";
import { BigNumber, BigNumberish, constants } from "ethers";
import { useEffect } from "react";

export const useRewards = (staker: Staker, tokenBalance: BigNumberish, tenderTokenBalance: BigNumberish) => {
  const { account } = useEthers();
  const { data, refetch } = useQuery<Queries.UserDeployments>(Queries.GetUserDeployments, {
    variables: { id: `${account?.toLowerCase()}_${staker.subgraphId}` },
    context: { chainId: staker.chainId },
  });
  // update my stake when tokenBalance changes
  useEffect(() => {
    refetch();
  }, [refetch, tokenBalance]);

  const claimedRewards = BigNumber.from(data?.userDeployments?.[0]?.claimedRewards ?? "0");
  const tenderizerStake = BigNumber.from(data?.userDeployments?.[0]?.tenderizerStake ?? "0");
  const myRewards = claimedRewards.add(tenderTokenBalance).sub(tenderizerStake);
  const rewards = myRewards.isNegative() ? constants.Zero : myRewards;

  return { rewards };
};
