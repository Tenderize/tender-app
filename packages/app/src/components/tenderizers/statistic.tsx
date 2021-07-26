import { FC } from "react";
import styled from "styled-components";

import { Text, TextExtendedProps } from "grommet";

const Symbol = styled(Text)`
  font-family: IBM Plex Sans;
  font-style: normal;
  font-weight: 300;
  font-size: 18px;
  color: #ffffff;
`;

const Stat = styled(Text)`
  font-family: IBM Plex Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 52px;
  color: #ffffff;
`;

const Decimals = styled(Text)`
  font-family: IBM Plex Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  color: #ffffff;
`;

const Statistic: FC<TextExtendedProps> = (props) => {
  const val = props.children?.toString().split(" ") || "";
  const symbol = val[1];
  const floatString = val[0].split(".");
  const int = floatString[0];
  const dec = floatString.length > 1 ? `.${floatString[1].slice(0, 3)}` : "";
  return (
    <Text textAlign="end">
      <Stat>{int}</Stat>
      <Decimals>{dec}</Decimals>
      <Symbol>{` ${symbol}`}</Symbol>
    </Text>
  );
};

export default Statistic;
