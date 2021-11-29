import { FC } from "react";
import { Box, Heading, Paragraph } from "grommet";
import { HighlightContainer } from "./HighlightContainer";
import { ScreenSize, screenToFontSize } from "./helper";

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
          TenderTokens unleashes the combination of staked assets for use in DeFi protocols and lets you earn yield on
          top of yield. They provide a new financial primitive that unlocks a wide array of new use cases for your
          staked web3 tokens.
        </Paragraph>
      </Box>
    </HighlightContainer>
  );
};
