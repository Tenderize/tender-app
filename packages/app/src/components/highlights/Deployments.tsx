import { FC } from "react";
import { Box, Heading } from "grommet";
import { HighlightContainer } from "./HighlightContainer";
import FeaturedCards from "../featured-card";

export const Deployments: FC = () => {
  return (
    <HighlightContainer count={5}>
      <Box align="center" style={{ position: "relative", marginTop: "14%" }}>
        <Heading>Tender APYs</Heading>
        <FeaturedCards />
      </Box>
    </HighlightContainer>
  );
};
