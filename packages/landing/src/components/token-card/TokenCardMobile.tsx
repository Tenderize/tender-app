import { FC } from "react";
import { Box, Text } from "grommet";
import Image from "next/image";
type Props = {
  description: string;
  stakerAddress: string;
  title: string;
  apy: string;
  logo: string;
  bwLogo: string;
  neonLogo: string;
  symbol: string;
};

const TokenCardMobile: FC<Props> = ({ neonLogo, symbol, title, apy }) => {
  const [apyWhole, apyFraction] = apy.split(".");

  return (
    <Box
      pad="medium"
      gap="small"
      direction="row"
      align="center"
      style={{
        background: "rgba(15, 15, 15, 0.7)",
        backdropFilter: "blur(25px)",
        borderRadius: "1.5rem",
        minWidth: "14rem",
      }}
    >
      <Box width="xxsmall">
        <Image src={`/${neonLogo}`} width={45} height={45} />
      </Box>
      <Box>
        <Box direction="row" gap="small">
          <Text style={{ opacity: 0.5 }} size="medium">
            {symbol}
          </Text>
          <Text style={{ opacity: 0.5, fontStyle: "italic" }} size="medium">
            {title}
          </Text>
        </Box>
        <Box direction="column" align="left" gap="small">
          <Text size="large" weight="bold">
            <Text size="xxlarge">{apyWhole}</Text>
            <Text size="medium">.{apyFraction}</Text>
            <Text size="medium">%</Text>
            <Text style={{ opacity: 0.5 }} size="small">
              &nbsp;APY
            </Text>
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default TokenCardMobile;
