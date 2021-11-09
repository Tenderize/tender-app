import { FC } from "react";
import { Box, Heading, Paragraph } from "grommet";
import Link from "next/link";
import { XLButton } from "../base";
import { HighlightContainer } from "./HighlightContainer";
import { ScreenSize, screenToFontSize } from "./helper";

export const Intro: FC<{ screenSize: ScreenSize }> = ({ screenSize }) => {
  console.log("screensize", screenSize);
  return (
    <HighlightContainer item="intro">
      <Box style={{ position: "relative", marginLeft: "48%", marginTop: "12%" }}>
        <Heading style={{ textShadow: "0px 0px 17px #AD01FF" }} size={screenToFontSize(screenSize)}>
          Tenderize
        </Heading>
        <Paragraph margin="none" size={screenToFontSize(screenSize)}>
          The tastiest liquid stake farming money can buy.
        </Paragraph>
        <Box direction="row" gap={screenToFontSize(screenSize)} pad={{ top: "medium" }}>
          <Link href="/stakers/livepeer">
            <XLButton
              secondary
              size={screenToFontSize(screenSize)}
              label="Open App"
              style={{ color: "white", borderColor: "white", borderRadius: 4 }}
            />
          </Link>
          <Link href="#deployments">
            <XLButton
              secondary
              size={screenToFontSize(screenSize)}
              label="Learn more"
              style={{
                color: screenSize === "xlarge" ? "white" : undefined,
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
