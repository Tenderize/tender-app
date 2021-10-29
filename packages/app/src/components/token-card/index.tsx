import { FC } from "react";
import { Box, Text, Image } from "grommet";

type Props = {
  url: string;
  info: CardInfo;
  apy: string;
};

type CardInfo = {
  description: string;
  stakerAddress: string;
  title: string;
  available: boolean;
  apy: number;
  logo: string;
  bwLogo: string;
  bwTenderLogo: string;
  symbol: string;
};

const TokenCard: FC<Props> = (props) => {
  const { info, apy } = props;

  return (
    <Box
      pad={{ vertical: "large", horizontal: "medium" }}
      gap="small"
      style={{
        background: "rgba(15, 15, 15, 0.7)",
        backdropFilter: "blur(25px)",
        borderRadius: "5rem",
      }}
    >
      <Box height="xsmall" width="xsmall">
        <Image src={`/${info.bwTenderLogo}`} fit="contain" />
      </Box>
      <Text style={{ opacity: 0.5 }} size="large">
        {info.symbol}
      </Text>
      <Text style={{ opacity: 0.5 }} size="large">
        {info.title}
      </Text>
      <Box direction="column" align="center" gap="small">
        {info.available ? (
          <>
            <Text size="large" weight="bold">
              <Text size="xxlarge">{apy}</Text>
              <Text size="medium">%</Text>
              <Text style={{ opacity: 0.5 }} size="small">
                &nbsp;projected APY
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
