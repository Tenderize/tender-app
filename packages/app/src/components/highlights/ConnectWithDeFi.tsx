import { FC } from "react";
import { Box, Heading, Paragraph } from "grommet";
import { HighlightContainer } from "./HighlightContainer";
import { ScreenSize, screenToFontSize } from "./helper";
import { Copy } from "./constants";

export const ConnectWithDeFi: FC<{ screenSize: ScreenSize; setVisibleIndex: (v: number) => void; index: number }> = ({
  screenSize,
  setVisibleIndex,
  index,
}) => {
  return (
    <HighlightContainer item="defi" setVisibleIndex={setVisibleIndex} index={index}>
      <Box style={{ position: "relative", marginLeft: "52%", marginTop: "16%" }}>
        <Heading style={{ textShadow: "0px 0px 8px #0075FF" }} size={screenToFontSize(screenSize)}>
          Connect with DeFi
        </Heading>
        <Paragraph margin="none" size={screenToFontSize(screenSize)}>
          {Copy.DEFI}
        </Paragraph>
      </Box>
    </HighlightContainer>
  );
};
