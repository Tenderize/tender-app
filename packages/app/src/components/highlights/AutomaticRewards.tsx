import { FC } from "react";
import { Box, Heading, Paragraph } from "grommet";

export const AutomaticRewards: FC = () => {
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
        <Heading>Automatic Rewards</Heading>
        <Paragraph margin="none">
          In the contemporary world, rewards for better performance and success matter more than the actual achievement
          itself. Indeed, as the global financial crisis showed, rewards were everything for the bankers as they strove
          for more reckless bets and increasing risk taking.
        </Paragraph>
      </Box>
    </Box>
  );
};
