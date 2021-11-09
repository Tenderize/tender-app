import { FC } from "react";
import { Box, Heading, Paragraph } from "grommet";
import { HighlightContainer } from "./HighlightContainer";
import { ScreenSize, screenToFontSize } from "./helper";

export const EasyStaking: FC<{ screenSize: ScreenSize }> = ({ screenSize }) => {
  return (
    <HighlightContainer item="staking">
      <Box style={{ position: "relative", marginLeft: "52%", marginTop: "14%" }}>
        <Heading style={{ textShadow: "0px 0px 8px #0075FF" }} size={screenToFontSize(screenSize)}>
          Easy Staking
        </Heading>
        <Paragraph margin="none" size={screenToFontSize(screenSize)}>
          Because of the system of flawed incentives, rewards were seen to the ultimate prize that was greater than the
          actual process of winning.
        </Paragraph>
      </Box>
    </HighlightContainer>
  );
};
