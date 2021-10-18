import { FC } from "react";
import { Box, Heading, Paragraph } from "grommet";

export const AutomaticRewards: FC = () => {
  return (
    <Box
      style={{
        width: "100vw",
        aspectRatio: "3496/2318",
        backgroundImage: "url('/redesign/shad-2.jpg')",
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
          <Box style={{ position: "relative", marginLeft: "15%", marginTop: "14%" }}>
            <Heading>Automatic Rewards</Heading>
            <Paragraph margin="none">
              In the contemporary world, rewards for better performance and success matter more than the actual
              achievement itself. Indeed, as the global financial crisis showed, rewards were everything for the bankers
              as they strove for more reckless bets and increasing risk taking.
            </Paragraph>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
