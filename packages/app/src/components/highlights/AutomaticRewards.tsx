import { FC } from "react";
import { Box, Heading, Paragraph } from "grommet";
import { HighlightContainer } from "./HighlightContainer";
import { ScreenSize, screenToFontSize } from "./helper";

export const AutomaticRewards: FC<{ screenSize: ScreenSize; setVisibleIndex: (v: number) => void; index: number }> = ({
  screenSize,
  setVisibleIndex,
  index,
}) => {
  return (
    <HighlightContainer item="rewards" setVisibleIndex={setVisibleIndex} index={index}>
      <Box style={{ position: "relative", marginLeft: "15%", marginTop: "11%" }}>
        <Heading style={{ textShadow: "0px 0px 8px #0075FF" }} size={screenToFontSize(screenSize)}>
          Automatic Rewards
        </Heading>
        <Paragraph margin="none" size={screenToFontSize(screenSize)}>
          In the contemporary world, rewards for better performance and success matter more than the actual achievement
          itself. Indeed, as the global financial crisis showed, rewards were everything for the bankers as they strove
          for more reckless bets and increasing risk taking.
        </Paragraph>
      </Box>
    </HighlightContainer>
  );
};
