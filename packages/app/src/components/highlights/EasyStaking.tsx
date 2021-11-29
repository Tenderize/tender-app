import { FC } from "react";
import { Box, Heading, Paragraph } from "grommet";
import { HighlightContainer } from "./HighlightContainer";
import { ScreenSize, screenToFontSize } from "./helper";

export const EasyStaking: FC<{ screenSize: ScreenSize; setVisibleIndex: (v: number) => void; index: number }> = ({
  screenSize,
  setVisibleIndex,
  index,
}) => {
  return (
    <HighlightContainer item="staking" setVisibleIndex={setVisibleIndex} index={index}>
      <Box style={{ position: "relative", marginLeft: "50%", marginTop: "12%" }}>
        <Heading style={{ textShadow: "0px 0px 8px #0075FF" }} size={screenToFontSize(screenSize)}>
          Easy Staking
        </Heading>
        <Paragraph margin="none" size={screenToFontSize(screenSize)}>
          Tenderize creates a care-free staking experience. Simply deposit your tokens to earn rewards and watch your
          balance increase, allocations are managed by the Tenderize protocol.
        </Paragraph>
      </Box>
    </HighlightContainer>
  );
};
