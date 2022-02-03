import { FC, useState } from "react";
import { Box, Button, Text, Heading, Layer, Card, CardHeader, CardBody, BoxExtendedProps } from "grommet";
import { FormClose } from "grommet-icons";
import { HeightType, WidthType } from "grommet/utils";

type props = {
  title: string;
  openButtonLabel: string;
  description?: string;
  button1?: React.ReactNode;
  button2?: React.ReactNode;
  card?: BoxExtendedProps;
  height?: HeightType | undefined;
  width?: WidthType | undefined;
};

const Dialog: FC<props> = (props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button plain onClick={handleShow} label={props.openButtonLabel} />
      {show && (
        <Layer style={{ overflow: "auto" }} animation="fadeIn" onEsc={handleClose} onClickOutside={handleClose}>
          <Card
            flex={false}
            style={{ position: "relative" }}
            pad={props.card?.pad || { horizontal: "medium", bottom: "medium" }}
            height={props.card?.height || "medium"}
            width={props.card?.width || "medium"}
          >
            <Button
              style={{ position: "absolute", top: 10, right: 10 }}
              plain
              icon={<FormClose />}
              onClick={handleClose}
            />
            <CardHeader justify="center" pad="none">
              <Heading level={2} alignSelf="center">
                {props.title}
              </Heading>
            </CardHeader>
            <CardBody>
              <Box flex justify="evenly">
                <Text textAlign="center">{props.description}</Text>
                <Box gap="small" direction="row" justify="center">
                  {props.button1}
                  {props.button2}
                </Box>
              </Box>
            </CardBody>
          </Card>
        </Layer>
      )}
    </>
  );
};

export default Dialog;
