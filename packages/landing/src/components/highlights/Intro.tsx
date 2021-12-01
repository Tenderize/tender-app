import { FC } from "react";
import { Anchor, Box, Heading, Paragraph } from "grommet";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { XLButton } from "../base";
import { HighlightContainer } from "./HighlightContainer";
import { ScreenSize, screenToFontSize } from "./helper";

export const Intro: FC<{ screenSize: ScreenSize; setVisibleIndex: (v: number) => void; index: number }> = ({
  screenSize,
  setVisibleIndex,
  index,
}) => {
  return (
    <HighlightContainer item="intro" setVisibleIndex={setVisibleIndex} index={index}>
      <Box style={{ position: "relative", marginLeft: "46%", marginTop: "11.5%" }}>
        <Heading style={{ textShadow: "0px 0px 17px #AD01FF" }} size={"large"}>
          Tenderize
        </Heading>
        <Paragraph margin="none" size={screenToFontSize(screenSize)}>
          Connecting Web3 with DeFi through <span style={{ fontWeight: 500 }}>Liquid Staking</span>
        </Paragraph>
        <Box>
          <Box direction="row" gap={screenToFontSize(screenSize)} pad={{ top: "medium" }} margin={{ bottom: "small" }}>
            <a href="https://rinkeby.tenderize.me" target="_blank">
              <XLButton
                secondary
                size={screenToFontSize(screenSize)}
                label="Open App"
                style={{ color: "white", borderColor: "white", borderRadius: 4 }}
              />
            </a>

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
          <Box direction="row" gap="small" align="center">
            <Anchor
              size="large"
              color="white"
              a11yTitle="Chat with us on Discord"
              href="https://discord.gg/WXR5VBttP5"
              icon={<FontAwesomeIcon icon={faDiscord} />}
              target="_blank"
              style={{ paddingLeft: 0 }}
            />
            <Anchor
              size="large"
              color="white"
              a11yTitle="Follow us on Twitter"
              href="https://twitter.com/tenderize_me"
              icon={<FontAwesomeIcon icon={faTwitter} />}
              target="_blank"
            />
          </Box>
        </Box>
      </Box>
    </HighlightContainer>
  );
};
