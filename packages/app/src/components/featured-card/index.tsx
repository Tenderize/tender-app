import { FC } from "react";
import { Box } from "grommet";

import TokenCard from "../token-card";
import stakers from "../../data/stakers";
import { TenderizerDaysType, GetTenderizerDays } from "../../pages/token/queries";
import { useQuery } from "@apollo/client";

const FeaturedCards: FC = () => {
  const cards = [];
  let key: string;

  const monthAgo = getUnixTimestampMonthAgo();
  const { data } = useQuery<TenderizerDaysType>(GetTenderizerDays, {
    variables: { from: monthAgo },
  });

  for (key in stakers) {
    let apyInPoints = 0;
    if (data != null) {
      const dpyData = Array.from(data.tenderizerDays)
        .filter((item) => item.id.includes(stakers[key].subgraphId))
        .slice(0, -1)

      const dayStart = parseInt(dpyData[0].id.split("_")[0])
      const dayEnd = parseInt(dpyData[dpyData.length - 1].id.split("_")[0])
      const daysElapsed = dayEnd - dayStart + 1

      const sumDPYInPoints = dpyData.reduce((seedValue, item) => seedValue + parseFloat(item.DPY), 0);

      const yearlyAvarageRate = (sumDPYInPoints / daysElapsed ) * 365;
      apyInPoints = Math.pow(1 + yearlyAvarageRate / 365, 365) - 1;
      
    }
    const apy = (apyInPoints * 100).toFixed(2);
    cards.push(<TokenCard key={key} info={stakers[key]} url={key} apy={apy} />);
  }
  return (
    <Box direction="row" justify="around" align="center">
      {cards}
    </Box>
  );
};

const getUnixTimestampMonthAgo = () => {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  d.setHours(0, 0, 0, 0);
  return d.getTime() / 1000;
};

export default FeaturedCards;
