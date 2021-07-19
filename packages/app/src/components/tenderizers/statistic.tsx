import { FC } from "react";
import styled from "styled-components";

import { Box, Text, TextExtendedProps } from "grommet";

const Symbol = styled(Text)`
  font-family: IBM Plex Sans;
  font-style: normal;
  font-weight: 300;
  font-size: 18px;
  vertical-align: bottom;
  color: #ffffff;
`;

const Stat = styled(Text)`
  font-family: IBM Plex Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 56px;
  vertical-align: bottom;
  color: #ffffff;
`;

const Decimals = styled(Text)`
  font-family: IBM Plex Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  color: #ffffff;
  vertical-align: bottom;
`;

const Statistic: FC<TextExtendedProps> = (props) => {
  const val = props.children?.toString().split(" ") || "";
  const symbol = val[1];
  const floatString = val[0].split(".");
  const int = floatString[0];
  const dec = floatString.length > 1 ? `.${floatString[1].slice(0, 3)}` : "";
  return (
    <Box flex direction="row" align="start" justify="start" gap="xxsmall">
      <Stat>{int}</Stat>
      <Decimals>{dec}</Decimals>
      <Symbol>{symbol}</Symbol>
    </Box>
  );
};

export default Statistic;
