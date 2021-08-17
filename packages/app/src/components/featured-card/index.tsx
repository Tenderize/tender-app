import { FC } from "react";
import { Box } from "grommet";

import TokenCard from "../token-card";
import stakers from "../../data/stakers";
import { DPYResponseType, GetDPY } from "../../pages/token/queries";
import { useQuery } from "@apollo/client";

const FeaturedCards: FC = () => {
  const cards = [];
  let key: string;

  const monthAgo = getUnixTimestampMonthAgo();
  const { data } = useQuery<DPYResponseType>(GetDPY, {
    variables: { from: monthAgo },
  });

  for (key in stakers) {
    let apy = 0;
    if (data != null) {
      const deploymentDPYData = Array.from(data.tenderizerDays)
        .filter((item) => item.id.toLowerCase().includes(stakers[key].name))
        .slice(0, -1)
        .filter((item) => item.DPY !== "0");
      const sumDPY = deploymentDPYData.reduce((seedValue, item) => seedValue + parseInt(item.DPY), 0);

      if (sumDPY !== 0) {
        apy = (sumDPY / deploymentDPYData.length) * 365;
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
