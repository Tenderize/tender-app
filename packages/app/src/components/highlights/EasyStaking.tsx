import { FC } from "react";
import { Box, Heading, Paragraph } from "grommet";
import { HighlightContainer } from "./HighlightContainer";

export const EasyStaking: FC = () => {
  return (
    <HighlightContainer count={4}>
      <Box style={{ position: "relative", marginLeft: "52%", marginTop: "16%" }}>
        <Heading>Easy Staking</Heading>
        <Paragraph margin="none">
          Because of the system of flawed incentives, rewards were seen to the ultimate prize that was greater than the
          actual process of winning.
        </Paragraph>
      </Box>
    </HighlightContainer>
  );
};
