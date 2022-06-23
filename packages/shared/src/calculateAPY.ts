import { Queries, stakers, Staker } from "@tender/shared/src/index";
import { ProtocolName } from "./data/stakers";
import { BigNumber, constants, utils } from "ethers";

const YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export const calculateAPY = (data: Queries.TenderizerDays | undefined): Record<Staker["name"], Staker> => {
  const stakersWithAPY = Object.values(stakers).map((staker) => {
    let apyInPoints = 0;
    if (data != null) {
      const rewardsClaimedEvents = data.tenderizer.filter((item) => item.id.includes(staker.subgraphId))[0]
        .rewardsClaimedEvents;
      console.log(rewardsClaimedEvents);
      if (rewardsClaimedEvents.length === 0) {
        apyInPoints = 0;
      } else {
        const eventsDataWithAPY = rewardsClaimedEvents
          .filter((item) => item.rewards !== "0")
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
            const apy = Math.pow(1 + amount / compoundsPerYear, compoundsPerYear) - 1;
            console.log("amount", amount);
            console.log("compoundsPerYear", compoundsPerYear);

            return apy;
          })
          .filter((item): item is number => item != null);

        console.log("reduce");
        //    console.log("eventsDataWithAPY", eventsDataWithAPY);
        apyInPoints = eventsDataWithAPY.reduce((prev, current) => prev + current, 0) / eventsDataWithAPY.length;
        console.log("reduce over");
      }
    }
    const apy = (apyInPoints * 100).toFixed(2);
    console.log("apy", apy);
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
