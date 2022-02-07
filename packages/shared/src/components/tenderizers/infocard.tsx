import { FC } from "react";
import { Box, Card, CardHeader, CardBody, CardFooter, Text } from "grommet";
import { Statistic } from "./statistic";

type Props = {
  title: string;
  text: string;
  subText?: string;
  align?: string;
};

export const InfoCard: FC<Props> = ({ title = "", text = "", subText = "", align = "baseline" }) => {
  return (
    <Box fill="horizontal">
      <Card align={align} elevation="none" round="none">
        <CardHeader
          pad={{
            horizontal: "0",
            bottom: "small",
          }}
        >
          {title}
        </CardHeader>
        <CardBody
          pad={{
            vertical: "small",
          }}
        >
          <Statistic>{text}</Statistic>
        </CardBody>
        <CardFooter>
          <Text color="dark-4" size="small">
            {subText}
          </Text>
        </CardFooter>
      </Card>
    </Box>
  );
};
