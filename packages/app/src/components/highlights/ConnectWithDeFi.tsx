import { FC } from "react";
import { Box, Heading, Paragraph } from "grommet";

export const ConnectWithDeFi: FC = () => {
  return (
    <Box
      style={{
        width: "100vw",
        height: (1055 / 2) * 2,
        backgroundImage: "url('/redesign/shad-3.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
      }}
    >
      {" "}
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
            backgroundImage: "url('/redesign/02_defi.svg')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        >
          <Box style={{ position: "relative", marginLeft: "52%", marginTop: "18%" }}>
            <Heading>Connect with DeFi</Heading>
            <Paragraph margin="none">
              What we mean by this is that it is okay to reward a high performer for his or her stellar performance but
              not to the point where in the pursuit of rewards, the individual throws caution to the winds and indulges
              in unethical behavior.
            </Paragraph>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
