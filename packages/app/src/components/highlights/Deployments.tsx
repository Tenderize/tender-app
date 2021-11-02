import { FC } from "react";
import { Box, Heading } from "grommet";
import { HighlightContainer } from "./HighlightContainer";
import FeaturedCards from "../featured-card";

export const Deployments: FC = () => {
  return (
    <HighlightContainer item="deployments">
      <Box align="center" gap="medium" style={{ position: "relative", marginTop: "14%" }}>
        <Heading
          style={{
            position: "relative",
            textShadow: "0px 0px 17px rgba(63, 19, 237, 0.88)",
          }}
        >
          <Box
            style={{
              position: "absolute",
              top: -110,
              left: -160,
              width: 294.5,
              height: 389,
              backgroundImage: `url('/landing/hammer.svg')`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
            }}
          />
          Tender APYs
        </Heading>
        <FeaturedCards />
      </Box>
    </HighlightContainer>
  );
};
