import useSWR from "swr";
import { Queries, stakers } from "@tender/shared/src/index";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useAPYData = () => {
  const { data } = useSWR<Queries.TenderizerDaysType>("/api/apy", fetcher);

  const stakersWithAPY = Object.values(stakers).map((staker) => {
    let apyInPoints = 0;
    if (data != null) {
      const dpyData = Array.from(data.tenderizerDays).filter((item) => item.id.toLowerCase().includes(staker.name));

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

  return { stakersWithAPY };
};
