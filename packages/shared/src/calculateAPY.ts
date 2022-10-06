import { Queries, stakers, Staker } from "@tender/shared/src/index";
import { ProtocolName } from "./data/stakers";

const YEAR_IN_SECONDS = 60 * 60 * 24 * 365;
type apycalc = { apy: number, timeDiff: number }

export const calculateAPY = (data: Queries.TenderizerDaysType | undefined): Record<Staker["name"], Staker> => {
  const stakersWithAPY = Object.values(stakers).map((staker) => {
    if (data == null) return 0;

    const tenderizerData = data.tenderizers.find((item) => item.id.includes(staker.subgraphId)) ?? {
      id: staker.subgraphId,
      rewardsClaimedEvents: [],
    };
    const rewardsClaimedEvents = tenderizerData.rewardsClaimedEvents.filter((item) => item.rewards !== "0");
    let totalTimePassed = 0
    const apysBasedOnSingleEvents: Array<apycalc> = rewardsClaimedEvents
      .map((value, index) => {
        console.log(value)
        // we need the first value's timestamp but not the rewards
        if (index === 0) {
          return { apy: 0, timeDiff: 0 };
        }

        const currentEvent = value;
        const previousEvent = rewardsClaimedEvents[index - 1];

        const rate = Number.parseFloat(currentEvent.rewards) / Number.parseFloat(currentEvent.oldPrincipal);
        const timeDiff = currentEvent.timestamp - previousEvent.timestamp;
        totalTimePassed += timeDiff
        const compoundsPerYear = Math.floor(YEAR_IN_SECONDS / timeDiff);
        const apy = Math.pow(1 + rate, compoundsPerYear) - 1;
        return { apy: apy || 0, timeDiff: timeDiff || 0 };
      })

    const normalizeApys = apysBasedOnSingleEvents.slice(1).map(o => o.apy * o.timeDiff)
    const final = normalizeApys.reduce((p, n) => p + n) / totalTimePassed

    const apy = final ? (final * 100).toFixed(2) : "0";
    return {
      ...staker,
      apy,
    };
  });

  const stakersWithAPYMap = {} as Record<ProtocolName, Staker>;
  for (const staker of stakersWithAPY) {
    if (staker == 0) continue;
    stakersWithAPYMap[staker.name] = staker;
  }
  return stakersWithAPYMap;
};

export const getUnixTimestampQuarter = () => {
  const d = new Date();
  d.setMonth(d.getMonth() - 3);
  d.setHours(0, 0, 0, 0);
  return d.getTime() / 1000;
};
