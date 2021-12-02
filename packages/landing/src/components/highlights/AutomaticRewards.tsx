import { FC } from "react";
import { Box, Heading, Paragraph } from "grommet";
import { HighlightContainer } from "./HighlightContainer";
import { ScreenSize, screenToFontSize } from "./helper";
import { Copy } from "./constants";

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
          {Copy.REWARDS_1}
        </Paragraph>
        <Paragraph margin={{ top: "small" }} size={screenToFontSize(screenSize)}>
          {Copy.REWARDS_2}
        </Paragraph>
      </Box>
    </HighlightContainer>
  );
};
