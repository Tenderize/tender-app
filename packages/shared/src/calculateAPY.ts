import { Queries, stakers, Staker } from "@tender/shared/src/index";
import { ProtocolName } from "./data/stakers";
import { BigNumber, constants } from "ethers";

const YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export const calculateAPY = (data: Queries.TenderizerDays | undefined): Record<Staker["name"], Staker> => {
  const stakersWithAPY = Object.values(stakers).map((staker) => {
    let apyInPoints = constants.Zero;
    if (data != null) {
      const tenderizerEventsData = data.tenderizer
        .filter((item) => item.rewardsClaimedEvents.rewards !== "0")
        .filter((item) => item.id.includes(staker.subgraphId));

      if (tenderizerEventsData.length === 0) {
        apyInPoints = constants.Zero;
      } else {
        const eventsDataWithAPY = tenderizerEventsData
          .map((value, index) => {
            // we need the first value's timestamp but not the rewards
            if (index === 0) {
              return {
                ...value,
                apy: null,
              };
            }
            const currentEvent = value.rewardsClaimedEvents;
            const previousEvent = tenderizerEventsData[index - 1].rewardsClaimedEvents;
            console.log(currentEvent);
            const amount = BigNumber.from(currentEvent.rewards);
            const timeDiff = currentEvent.timestamp - previousEvent.timestamp;
            const compoundsPerYear = YEAR_IN_SECONDS / timeDiff;
            const apy = constants.One.add(amount.div(compoundsPerYear)).pow(compoundsPerYear).sub(constants.One);

            return apy;
          })
          .filter((item): item is BigNumber => item != null);
        apyInPoints = eventsDataWithAPY.reduce((prev, current) => prev.add(current), constants.Zero);
      }
    }
    const apy = (apyInPoints.toNumber() * 100).toFixed(2);
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
