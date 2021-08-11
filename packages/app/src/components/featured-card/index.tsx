import { FC } from "react";
import { Box } from "grommet";

import TokenCard from "../token-card";
import stakers from "../../data/stakers";

const FeaturedCards: FC = () => {
  const cards = [];
  let key: string;
  for (key in stakers) {
    cards.push(
      <TokenCard
        // provider={{}}
        info={stakers[key]}
        url={key}
        key={key}
      />
    );
  }
  return (
    <Box direction="row" justify="around" align="center">
      {cards}
    </Box>
  );
};

export default FeaturedCards;
