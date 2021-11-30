import { FC } from "react";
import { Box, Heading, Paragraph } from "grommet";
import { HighlightContainer } from "./HighlightContainer";
import { ScreenSize, screenToFontSize } from "./helper";
import { Copy } from "./constants";

export const NoLockups: FC<{ screenSize: ScreenSize; setVisibleIndex: (v: number) => void; index: number }> = ({
  screenSize,
  setVisibleIndex,
  index,
}) => {
  return (
    <HighlightContainer item="lockups" setVisibleIndex={setVisibleIndex} index={index}>
      <Box style={{ position: "relative", marginLeft: "15%", marginTop: "12%" }}>
        <Heading style={{ textShadow: "0px 0px 8px rgba(237, 19, 32, 0.94)" }} size={screenToFontSize(screenSize)}>
          No Lockups
        </Heading>
        <Paragraph margin="none" size={screenToFontSize(screenSize)}>
          {Copy.LOCKUPS}
        </Paragraph>
      </Box>
    </HighlightContainer>
  );
};
