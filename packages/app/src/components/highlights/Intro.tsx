import { FC } from "react";
import { Box, Heading, Paragraph } from "grommet";

// 3496 x 2318
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
            backgroundImage: "url('/redesign/01_rewards.svg')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        >
          <Box style={{ position: "relative", marginLeft: "15%", marginTop: "18%" /* left: "52%", top: "25%" */ }}>
            <Heading>Tenderize</Heading>
            <Paragraph margin="none">The tastiest liquid stake farming money can buy.</Paragraph>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
