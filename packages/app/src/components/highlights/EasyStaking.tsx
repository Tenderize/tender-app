import { FC } from "react";
import { Box, Heading, Paragraph } from "grommet";

export const EasyStaking: FC = () => {
  return (
    <Box
      style={{
        width: "100vw",
        aspectRatio: "3496/2318",
        backgroundImage: "url('/redesign/shad-4.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        scrollSnapAlign: "start",
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
            backgroundImage: "url('/redesign/04_staking.svg')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        >
          <Box style={{ position: "relative", marginLeft: "52%", marginTop: "16%" }}>
            <Heading>Easy Staking</Heading>
            <Paragraph margin="none">
              Because of the system of flawed incentives, rewards were seen to the ultimate prize that was greater than
              the actual process of winning.
            </Paragraph>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
