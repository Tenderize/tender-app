import { FC } from "react";
import { Box, Card, CardHeader, CardBody } from "grommet";
import Statistic from "./statistic";

type Props = {
  title: string;
  text: string;
};

const InfoCard: FC<Props> = ({ title = "", text = "" }) => {
  return (
    <Box fill="horizontal">
      <Card align="baseline" elevation="none" round="none">
        <CardHeader
          pad={{
            horizontal: "0",
            vertical: "small",
          }}
        >
          {title}
        </CardHeader>
        <CardBody
          pad={{
            horizontal: "0",
            vertical: "small",
          }}
        >
          <Statistic>{text}</Statistic>
        </CardBody>
      </Card>
    </Box>
  );
};

export default InfoCard;
