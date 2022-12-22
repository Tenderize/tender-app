import { useQuery } from "@apollo/client";
import { Queries, getUnixTimestampQuarter, calculateAPY, Staker } from "@tender/shared/src";
import { useEffect } from "react";

export const useAPY = (staker: Staker) => {
  const { data: apyData, refetch: refetchAPY } = useQuery<Queries.TenderizerDaysType>(Queries.GetTenderizerDays, {
    query: Queries.GetTenderizerDays,
    variables: { from: getUnixTimestampQuarter() },
    context: { chainId: staker.chainId },
  });

  const protocolAPYs = Object.values(calculateAPY(apyData));
  const apy = protocolAPYs.find((v) => v.subgraphId === staker.subgraphId)?.apy ?? "";

  // update when chainId changes
  useEffect(() => {
    refetchAPY();
  }, [refetchAPY, staker.chainId]);

  return { apy };
};
