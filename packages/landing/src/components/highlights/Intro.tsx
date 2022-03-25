import { FC } from "react";
import { Box, Button, ButtonExtendedProps, Heading, Paragraph } from "grommet";
import Link from "next/link";
import styled from "styled-components";
import { HighlightContainer } from "./HighlightContainer";
import { ScreenSize, screenToFontSize } from "./helper";

export const Intro: FC<{ screenSize: ScreenSize; setVisibleIndex: (v: number) => void; index: number }> = ({
  screenSize,
  setVisibleIndex,
  index,
}) => {
  return (
    <HighlightContainer item="intro" setVisibleIndex={setVisibleIndex} index={index}>
      <Box style={{ position: "relative", marginLeft: "45%", marginTop: "11.5%" }}>
        <Heading margin={{ bottom: "medium" }} style={{ textShadow: "0px 0px 17px #AD01FF" }} size={"large"}>
          Tenderize
        </Heading>
        <Paragraph margin="none" size={screenToFontSize(screenSize)}>
          Connecting Web3 with DeFi through <span style={{ fontWeight: 500 }}>Liquid Staking</span>
        </Paragraph>
        <Box>
          <Box direction="row" gap={screenToFontSize(screenSize)} pad={{ top: "medium" }} margin={{ bottom: "small" }}>
            <a href="https://testnet.tenderize.me" target="_blank">
              <XLButton secondary size={screenToFontSize(screenSize)} label="Open App" border />
            </a>

            <Link href="#defi">
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
      </Box>
    </HighlightContainer>
  );
};

export const XLButton: FC<ButtonExtendedProps & { border?: boolean }> = styled(Button)`
  width: 270px;
  height: 70px;
  border-color: ${(props: any) => (props.border ? "white" : undefined)};
  border-radius: 4px;
  &:hover {
    text-shadow: 0px 0px 12px #ad01ff;
    border-color: ${(props: any) => (props.border ? "#d98aff" : undefined)};
  }
`;
