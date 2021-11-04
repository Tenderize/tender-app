import { FC } from "react";
import { Box, Heading, Paragraph } from "grommet";
import Link from "next/link";
import { XLButton } from "../base";
import { HighlightContainer } from "./HighlightContainer";

export const Intro: FC = () => {
  return (
    <HighlightContainer item="intro">
      <Box style={{ position: "relative", marginLeft: "48%", marginTop: "12%" }}>
        <Heading style={{ textShadow: "0px 0px 17px #AD01FF" }}>Tenderize</Heading>
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
