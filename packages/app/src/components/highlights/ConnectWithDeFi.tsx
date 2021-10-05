import { FC } from "react";
import { Box, Heading, Paragraph } from "grommet";

export const ConnectWithDeFi: FC = () => {
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
        <Heading>Connect with DeFi</Heading>
        <Paragraph margin="none">
          What we mean by this is that it is okay to reward a high performer for his or her stellar performance but not
          to the point where in the pursuit of rewards, the individual throws caution to the winds and indulges in
          unethical behavior.
        </Paragraph>
      </Box>
    </Box>
  );
};
