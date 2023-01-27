import { useQuery } from "@apollo/client";
import { addresses } from "@tender/contracts/src";
import { Queries, stakers } from "@tender/shared/src";
import { ProtocolName } from "@tender/shared/src/data/stakers";
import { useEthers } from "@usedapp/core";
import { useEffect } from "react";

export const useLastProcessUnstakes = (protocolName: ProtocolName) => {
  const requiredChain = stakers[protocolName].chainId;
  const { account } = useEthers();

  const { data: processUnstakesEvents, refetch: refetchLastGovUnstakeEvent } = useQuery<Queries.ProcessUnstakes>(
    Queries.GetProcessUnstakes,
    {
      variables: {
        tenderizer: addresses[protocolName].tenderizer.toLowerCase(),
      },
      context: { chainId: requiredChain },
    }
  );

  useEffect(() => {
    refetchLastGovUnstakeEvent();
  }, [refetchLastGovUnstakeEvent, requiredChain, account]);

  let lastProcessUnstakesEvent: Queries.ProcessUnstakesEvent | undefined;
  if (processUnstakesEvents != null) {
    lastProcessUnstakesEvent = processUnstakesEvents.processUnstakesEvents.reduce((prev, current) => {
      if (current.timestamp > prev.timestamp) {
        return current;
      } else {
        return prev;
      }
    }, processUnstakesEvents.processUnstakesEvents[0]);
  }
  return { lastProcessUnstakesEvent };
};
