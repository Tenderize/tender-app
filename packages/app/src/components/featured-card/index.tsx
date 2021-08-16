import { FC } from "react";
import { Box } from "grommet";

import TokenCard from "../token-card";
import stakers from "../../data/stakers";
import { APYResponseType, GetAPY } from "../../pages/token/queries";
import { useQuery } from "@apollo/client";

const FeaturedCards: FC = () => {
  const cards = [];
  let key: string;

  const monthAgo = getUnixTimestampMonthAgo();
  const { data } = useQuery<APYResponseType>(GetAPY, {
    variables: { from: monthAgo },
  });

  for (key in stakers) {
    let apy = 0;
    if (data != null) {
      const deploymentAPYData = Array.from(data.tenderizerDays)
        .filter((item) => item.id.toLowerCase().includes(stakers[key].name))
        .filter((item) => item.APY !== "0");
      const dailyApy = deploymentAPYData.reduce((seedValue, item) => seedValue + parseInt(item.APY), 0);

      if (dailyApy !== 0) {
        apy = (dailyApy / deploymentAPYData.length) * 365;
      }
    }
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
