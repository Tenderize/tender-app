import { useQuery } from "@apollo/client";
import { Queries, Staker } from "@tender/shared/src";
import { useEthers } from "@usedapp/core";
import { Lock } from "components/deposit/types";
import { useEffect, useState } from "react";

export const useLocks = (staker: Staker) => {
  const { account } = useEthers();
  const requiredChain = staker.chainId;
  const [locks, setLocks] = useState<Lock[]>([]);

  const { data: unstakeEvents, refetch: refetchUnstakeEvents } = useQuery<Queries.PendingWithdrawals>(
    Queries.GetPendingWithdrawals,
    {
      variables: { from: `${account?.toLowerCase()}` },
      context: { chainId: requiredChain },
    }
  );

  useEffect(() => {
    refetchUnstakeEvents();
  }, [refetchUnstakeEvents, requiredChain, account]);

  useEffect(() => {
    if (unstakeEvents != null) {
      const locks = new Array<Lock>();
      unstakeEvents.unstakeEvents.forEach((unstakeEvent) => {
        const withdrawEvent = unstakeEvents.withdrawEvents.find(
          (withdrawEvent) => withdrawEvent.unstakeLockID === unstakeEvent.unstakeLockID
        );
        if (withdrawEvent == null) {
          locks.push({
            ...unstakeEvent,
            open: false,
          });
        }
      });
      setLocks(locks);
    }
  }, [unstakeEvents]);

  return { locks };
};
