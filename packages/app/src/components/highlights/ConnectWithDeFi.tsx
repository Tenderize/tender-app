import { FC } from "react";
import { Box, Heading, Paragraph } from "grommet";
import { HighlightContainer } from "./HighlightContainer";

export const ConnectWithDeFi: FC = () => {
  return (
    <HighlightContainer item="defi">
      <Box style={{ position: "relative", marginLeft: "52%", marginTop: "18%" }}>
        <Heading style={{ textShadow: "0px 0px 8px #0075FF" }}>Connect with DeFi</Heading>
        <Paragraph margin="none">
          What we mean by this is that it is okay to reward a high performer for his or her stellar performance but not
          to the point where in the pursuit of rewards, the individual throws caution to the winds and indulges in
          unethical behavior.
        </Paragraph>
      </Box>
    </HighlightContainer>
  );
};
