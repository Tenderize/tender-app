import { Queries, stakers, Staker } from "@tender/shared/src/index";
import { ProtocolName } from "./data/stakers";

export const calculateAPY = (data: Queries.TenderizerDaysType | undefined): Record<Staker["name"], Staker> => {
  const stakersWithAPY = Object.values(stakers).map((staker) => {
    let apyInPoints = 0;
    if (data != null) {
      const dpyData = Array.from(data.tenderizerDays).filter((item) => item.id.includes(staker.subgraphId));

      if (dpyData.length === 0) {
        apyInPoints = 0;
      } else {
        const dayStart = parseInt(dpyData[0].id.split("_")[0]);
        const dayEnd = parseInt(dpyData[dpyData.length - 1].id.split("_")[0]);
        const daysElapsed = dayEnd - dayStart + 1;
        const sumDPYInPoints = dpyData.reduce((seedValue, item) => seedValue + parseFloat(item.DPY), 0);
        const yearlyAvarageRate = (sumDPYInPoints / daysElapsed) * 365;
        apyInPoints = Math.pow(1 + yearlyAvarageRate / 365, 365) - 1;
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
