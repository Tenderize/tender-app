import { FC } from "react";
import { Box, Heading, Paragraph } from "grommet";
import { HighlightContainer } from "./HighlightContainer";

export const AutomaticRewards: FC = () => {
  return (
    <HighlightContainer count={1}>
      <Box style={{ position: "relative", marginLeft: "15%", marginTop: "14%" }}>
        <Heading style={{ textShadow: "0px 0px 8px #0075FF" }}>Automatic Rewards</Heading>
        <Paragraph margin="none">
          In the contemporary world, rewards for better performance and success matter more than the actual achievement
          itself. Indeed, as the global financial crisis showed, rewards were everything for the bankers as they strove
          for more reckless bets and increasing risk taking.
        </Paragraph>
      </Box>
    </HighlightContainer>
  );
};
