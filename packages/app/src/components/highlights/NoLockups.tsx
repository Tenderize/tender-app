import { FC } from "react";
import { Box, Heading, Paragraph } from "grommet";

export const NoLockups: FC = () => {
  return (
    <Box
      style={{
        width: "100vw",
        height: (1055 / 2) * 2,
        backgroundImage: "url('/redesign/shad-4.jpg')",
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
            height: (1055 / 2) * 2,
            backgroundImage: "url('/redesign/03_lockup.svg')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        >
          <Box style={{ position: "relative", marginLeft: "15%", marginTop: "14%" }}>
            <Heading>No Lockups</Heading>
            <Paragraph margin="none">
              Hence, rewards management has to be seen in the context of what are proper and just rewards and what are
              disproportionate rewards. The point here is that rewards ought to justify the performance and not exceed
              them.
            </Paragraph>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
