import { FC } from "react";
import { Box, Heading, Paragraph } from "grommet";

export const EasyStaking: FC = () => {
  return (
    <Box
      style={{
        width: "100vw",
        height: (1055 / 2) * 2,
        backgroundImage: "url('/redesign/2.svg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
      }}
    >
      <Box style={{ position: "relative", left: "52%", top: "25%" }}>
        <Heading>Easy Staking</Heading>
        <Paragraph margin="none">
          Because of the system of flawed incentives, rewards were seen to the ultimate prize that was greater than the
          actual process of winning.
        </Paragraph>
      </Box>
    </Box>
  );
};
