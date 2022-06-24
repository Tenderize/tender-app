import { Queries, stakers, Staker } from "@tender/shared/src/index";
import { ProtocolName } from "./data/stakers";

const YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export const calculateAPY = (data: Queries.TenderizerDays | undefined): Record<Staker["name"], Staker> => {
  const stakersWithAPY = Object.values(stakers).map((staker) => {
    let apyInPoints = 0;
    if (data != null) {
      const tenderizerData = data.tenderizer.find((item) => item.id.includes(staker.subgraphId)) ?? {
        id: staker.subgraphId,
        rewardsClaimedEvents: [],
      };
      const rewardsClaimedEvents = tenderizerData.rewardsClaimedEvents.filter((item) => item.rewards !== "0");

      if (rewardsClaimedEvents.length === 0) {
        apyInPoints = 0;
      } else {
        const apysBasedOnSingleEvents = rewardsClaimedEvents

          .map((value, index) => {
            // we need the first value's timestamp but not the rewards
            if (index === 0) {
              return null;
            }

            const currentEvent = value;
            const previousEvent = rewardsClaimedEvents[index - 1];
            const amount = Number.parseFloat(currentEvent.rewards) / Number.parseFloat(currentEvent.oldPrincipal);
            const timeDiff = currentEvent.timestamp - previousEvent.timestamp;
            const compoundsPerYear = Math.floor(YEAR_IN_SECONDS / timeDiff);
            const apy = Math.pow(1 + amount, compoundsPerYear) - 1;
            return apy;
          })
          .filter((item): item is number => item != null);
        apyInPoints =
          apysBasedOnSingleEvents.reduce((prev, current) => prev + current, 0) / apysBasedOnSingleEvents.length;
      }
    }
    const apy = (apyInPoints * 100).toFixed(2);
    return {
      ...staker,
      apy,
    };
  });

  const stakersWithAPYMap = {} as Record<ProtocolName, Staker>;
  for (const staker of stakersWithAPY) {
    stakersWithAPYMap[staker.name] = staker;
  }
  return stakersWithAPYMap;
};

export const getUnixTimestampMonthAgo = () => {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  d.setHours(0, 0, 0, 0);
  return d.getTime() / 1000;
};
