import { FC } from "react";
import { Box, Text } from "grommet";
import Image from "next/image";
import { ApyContent } from "./ApyContent";
import { formatCompactCurrency } from "@tender/shared/src";

type Props = {
  title: string;
  apy: string;
  tvl: number;
  neonLogo: string;
  symbol: string;
  available: boolean;
};

const TokenCardMobile: FC<Props> = ({ neonLogo, symbol, title, apy, tvl, available }) => {
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
    </Box>
  );
};

export default TokenCardMobile;
