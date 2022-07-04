import { FC } from "react";
import { Box, Text, Image } from "grommet";
import { ApyContent } from "./ApyContent";
import { formatCompactCurrency } from "@tender/shared/src";

const TokenCard: FC<{
  title: string;
  available: boolean;
  apy: string;
  tvl: number;
  neonLogo: string;
  symbol: string;
}> = ({ neonLogo, symbol, title, available, apy, tvl }) => {
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
          {`t${symbol}`}
        </Text>
        <Text margin="none" style={{ opacity: 0.5, fontStyle: "italic" }} size="medium">
          {title}
        </Text>
      </Box>
      <Box pad={{ horizontal: "medium" }} direction="column" align="left" gap="small">
        {available ? (
          <>
            <ApyContent apy={apy} />
            <Text size="large" weight="bold">
              <Text size="medium">{formatCompactCurrency(tvl)}</Text>
              <Text style={{ opacity: 0.5 }} size="small">
                &nbsp;TVL
              </Text>
            </Text>
          </>
        ) : (
          <Text size="medium">Coming Soon</Text>
        )}
      </Box>
    </Box>
  );
};

export default TokenCard;
