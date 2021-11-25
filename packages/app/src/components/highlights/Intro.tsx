import { FC } from "react";
import { Anchor, Box, Heading, Paragraph } from "grommet";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { XLButton } from "../base";
import { HighlightContainer } from "./HighlightContainer";
import { ScreenSize } from "./helper";

export const Intro: FC<{ screenSize: ScreenSize; setVisibleIndex: (v: number) => void; index: number }> = ({
  screenSize,
  setVisibleIndex,
  index,
}) => {
  return (
    <HighlightContainer item="intro" setVisibleIndex={setVisibleIndex} index={index}>
      <Box style={{ position: "relative", marginLeft: "48%", marginTop: "12%" }}>
        <Heading style={{ textShadow: "0px 0px 17px #AD01FF" }} size={"large"}>
          Tenderize
        </Heading>
        <Paragraph margin="none" size={"2.1rem"}>
          Connecting Web3 with DeFi through <span style={{fontWeight: 500}}>Liquid Staking</span>
        </Paragraph>
        {/* <Paragraph size={screenToFontSize(screenSize)}>
          <b>STAKE</b>, <b>EARN</b> simply and securely. <b>UNLOCK</b> staked assets for usage in DeFi.
        </Paragraph> */}
        <Box>
          <Box direction="row" gap={"LARGE"} pad={{ top: "medium" }} margin={{ top: "large", bottom: "small" }}>
            <Link href="/stakers/livepeer">
              <XLButton
                secondary
                size={"large"}
                label="Open App"
                style={{ color: "white", borderColor: "white", borderRadius: 4, fontSize: "1.3rem" }}
              />
            </Link>
            <Link href="#deployments">
              <XLButton
                secondary
                size={"large"}
                label="Learn more"
                style={{
                  color: screenSize === "xlarge" ? "white" : undefined,
                  border: "none",
                  justifyContent: "center",
                  fontSize: "1.3rem"
                }}
              />
            </Link>
          </Box>
          <Box direction="row" gap="small" align="center">
            <Anchor
              size="xlarge"
              color="white"
              a11yTitle="Chat with us on Discord"
              href="https://discord.gg/WXR5VBttP5"
              icon={<FontAwesomeIcon icon={faDiscord} />}
              target="_blank"
              style={{ paddingLeft: 0 }}
            />
            <Anchor
              size="xlarge"
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
