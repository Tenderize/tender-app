import { FC } from "react";
import { Box, Heading, Paragraph } from "grommet";
import { HighlightContainer } from "./HighlightContainer";
import { ScreenSize, screenToFontSize } from "./helper";

export const NoLockups: FC<{ screenSize: ScreenSize }> = ({ screenSize }) => {
  return (
    <HighlightContainer item="lockups">
      <Box style={{ position: "relative", marginLeft: "15%", marginTop: "12%" }}>
        <Heading style={{ textShadow: "0px 0px 8px rgba(237, 19, 32, 0.94)" }} size={screenToFontSize(screenSize)}>
          No Lockups
        </Heading>
        <Paragraph margin="none" size={screenToFontSize(screenSize)}>
          Hence, rewards management has to be seen in the context of what are proper and just rewards and what are
          disproportionate rewards. The point here is that rewards ought to justify the performance and not exceed them.
        </Paragraph>
      </Box>
    </HighlightContainer>
  );
};
