import { FC } from "react";
import { Box } from "grommet";

import TokenCard from "../token-card";
import stakers from "../../data/stakers";
import { TenderizerDaysType } from "../../queries";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const FeaturedCards: FC = () => {
  const { data } = useSWR<TenderizerDaysType>("/api/apy", fetcher);

  const cards = [];
  let key: string;

  for (key in stakers) {
    let apyInPoints = 0;
    if (data != null) {
      const dpyData = Array.from(data.tenderizerDays)
        .filter((item) => item.id.includes(stakers[key].subgraphId))
        .slice(0, -1);

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
    let apy = (apyInPoints * 100).toFixed(2);
    if (key === "/stakers/graph") apy = "39.74";
    cards.push(<TokenCard key={key} info={stakers[key]} url={key} apy={apy} />);
  }
  return (
    <Box direction="row" gap="medium" justify="around" align="center">
      {cards}
    </Box>
  );
};

export default FeaturedCards;
