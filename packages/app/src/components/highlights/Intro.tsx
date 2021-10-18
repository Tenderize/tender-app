import { FC } from "react";
import { Box, Heading, Paragraph } from "grommet";
import Link from "next/link";
import { XLButton } from "../base";

export const Intro: FC = () => {
  return (
    <Box
      style={{
        width: "100vw",
        aspectRatio: "3496/2318",
        backgroundImage: "url('/redesign/shad-0.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
      }}
    >
      <Box
        style={{
          backgroundImage: "url('/redesign/noise.png')",
          backgroundRepeat: "repeat",
        }}
      >
        <Box
          style={{
            width: "100vw",
            aspectRatio: "3496/2318",
            backgroundImage: "url('/redesign/00_hero.svg')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        >
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
        </Box>
      </Box>
    </Box>
  );
};
