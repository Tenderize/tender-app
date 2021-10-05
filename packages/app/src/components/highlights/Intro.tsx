import { FC } from "react";
import { Box, Heading, Paragraph } from "grommet";

export const Intro: FC = () => {
  return (
    <Box
      style={{
        width: "100vw",
        height: (1055 / 2) * 2,
        backgroundImage: "url('/redesign/1.svg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
      }}
    >
      <Box style={{ position: "relative", left: "52%", top: "25%" }}>
        <Heading>Tenderize</Heading>
        <Paragraph margin="none">The tastiest liquid stake farming money can buy.</Paragraph>
      </Box>
    </Box>
  );
};
