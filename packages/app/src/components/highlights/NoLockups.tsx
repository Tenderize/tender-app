import { FC } from "react";
import { Box, Heading, Paragraph } from "grommet";
import { HighlightContainer } from "./HighlightContainer";
import { ScreenSize, screenToFontSize } from "./helper";
import Foot from "../footer";

export const NoLockups: FC<{ screenSize: ScreenSize; setVisibleIndex: (v: number) => void; index: number }> = ({
  screenSize,
  setVisibleIndex,
  index,
}) => {
  return (
    <HighlightContainer item="lockups" setVisibleIndex={setVisibleIndex} index={index}>
      <div style={{ position: "relative", display: "flex", flex: 1 }}>
        <Box style={{ position: "relative", marginLeft: "15%", marginTop: "12%" }}>
          <Heading style={{ textShadow: "0px 0px 8px rgba(237, 19, 32, 0.94)" }} size={screenToFontSize(screenSize)}>
            No Lockups
          </Heading>
          <Paragraph margin="none" size={screenToFontSize(screenSize)}>
            Hence, rewards management has to be seen in the context of what are proper and just rewards and what are
            disproportionate rewards. The point here is that rewards ought to justify the performance and not exceed
            them.
          </Paragraph>
        </Box>
        <div
          style={{
            position: "absolute",
            width: "100%",
            bottom: 0,
          }}
        >
          <Foot />
        </div>
      </div>
    </HighlightContainer>
  );
};
