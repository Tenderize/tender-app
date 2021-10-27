import { FC } from "react";
import { Box, Heading, Paragraph } from "grommet";
import Link from "next/link";
import { XLButton } from "../base";
import { HighlightContainer } from "./HighlightContainer";

export const Intro: FC = () => {
  return (
    <HighlightContainer count={0}>
      <Box style={{ position: "relative", marginLeft: "52%", marginTop: "18%" }}>
        <Heading>Tenderize</Heading>
        <Paragraph margin="none">The tastiest liquid stake farming money can buy.</Paragraph>
        <Box direction="row" gap="medium" pad={{ top: "large" }}>
          <Link href="/stakers/livepeer">
            <XLButton
              secondary
              size="large"
              label="Open App"
              style={{ color: "white", borderColor: "white", borderRadius: 4 }}
            />
          </Link>
          <Link href="/stakers/livepeer">
            <XLButton
              secondary
              border="0"
              size="large"
              label="Learn more"
              style={{
                color: "white",
                border: "none",
                justifyContent: "center",
              }}
            />
          </Link>
        </Box>
      </Box>
    </HighlightContainer>
  );
};
