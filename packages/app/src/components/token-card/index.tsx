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
  const logo = require("../../images/" + info.bwTenderLogo);

  return (
    <Box pad="large" gap="small" style={{ flex: "1" }}>
      <Box align="center" margin={{ vertical: "small" }}>
        <Image src={logo.default} sizes="large" />
        <Text size="xlarge">{info.title}</Text>
      </Box>
        <Box direction="column" align="center" gap="small">

        {
              info.available ? 
                <>
              <Text size="medium" weight="normal" color="light-3">
                  APY
                </Text>
                <Text size="large" weight="bold">
                  {apy} <Text size="medium">%</Text>
                </Text>
                </>
              :
              <Text size="medium">Coming Soon</Text>
        }
        </Box>
    </Box>
  );
};

export default TokenCard;
