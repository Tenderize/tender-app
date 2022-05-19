import { FC } from "react";
import { Box, Text, Image } from "grommet";
import { ApyContent } from "./ApyContent";

const TokenCard: FC<{
  title: string;
  available: boolean;
  apy: string;
  neonLogo: string;
  symbol: string;
}> = ({ neonLogo, symbol, title, available, apy }) => {
  return (
    <Box
      pad={{ vertical: "medium", horizontal: "none" }}
      gap="small"
      style={{
        background: "rgba(15, 15, 15, 0.7)",
        backdropFilter: "blur(25px)",
        borderRadius: "3rem",
        minWidth: "11rem",
      }}
    >
      <Box width="xsmall">
        <Image src={`/${neonLogo}`} fit="contain" />
      </Box>
      <Box pad={{ horizontal: "medium" }}>
        <Text margin="none" style={{ opacity: 0.5 }} size="medium">
          {symbol}
        </Text>
        <Text margin="none" style={{ opacity: 0.5, fontStyle: "italic" }} size="medium">
          {title}
        </Text>
      </Box>
      <Box pad={{ horizontal: "medium" }} direction="column" align="left" gap="small">
        <ApyContent apy={apy} available={available} />
      </Box>
    </Box>
  );
};

export default TokenCard;
