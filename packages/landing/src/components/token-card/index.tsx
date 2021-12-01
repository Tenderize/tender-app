import { FC } from "react";
import { Box, Text, Image } from "grommet";

type Props = {
  description: string;
  stakerAddress: string;
  title: string;
  available: boolean;
  apy: string;
  logo: string;
  bwLogo: string;
  neonLogo: string;
  symbol: string;
};

const TokenCard: FC<Props> = ({ neonLogo, symbol, title, available, apy }) => {
  const [apyWhole, apyFraction] = apy.split(".");

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
        {available ? (
          <>
            <Text size="large" weight="bold">
              <Text size="xxlarge">{apyWhole}</Text>
              <Text size="medium">.{apyFraction}</Text>
              <Text size="medium">%</Text>
              <Text style={{ opacity: 0.5 }} size="small">
                &nbsp;APY
              </Text>
            </Text>
          </>
        ) : (
          <>
            <Text size="medium">Coming Soon</Text>
            <Text size="large" weight="bold">
              &nbsp;
            </Text>
          </>
        )}
      </Box>
    </Box>
  );
};

export default TokenCard;
