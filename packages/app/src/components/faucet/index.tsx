import { FC, useState } from "react";
import { contracts } from "@tender/contracts";
import { Box, Button, Text, Heading, Layer, Card, CardHeader, CardBody } from "grommet";
import { useContractFunction } from "@usedapp/core";

type props = {
  symbol: string;
  name: string;
};

const Faucet: FC<props> = ({ symbol, name }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { send } = useContractFunction(contracts[name].faucet, "request");

  // TODO why is this needed
  const requestTokens = () => {
    send();
  };

  return (
    <>
      <Button plain onClick={handleShow} label="Faucet" />
      {show && (
        <Layer style={{ overflow: "auto" }} animation="fadeIn" onEsc={handleClose} onClickOutside={handleClose}>
          <Card flex={false} pad="medium" height="medium" width="medium">
            <CardHeader>
              <Heading>{symbol} Faucet</Heading>
            </CardHeader>
            <CardBody>
              <Box width="large" gap="small">
                <Text>{`Get some testnet ${symbol} and ETH (you need ETH to get ${symbol})`}</Text>
                <Button primary onClick={requestTokens} label={`Get ${symbol}`} />
                <Button
                  primary
                  href="https://faucet.metamask.io/"
                  target="_blank"
                  label="Get ETH"
                  style={{ textAlign: "center" }}
                />
              </Box>
            </CardBody>
          </Card>
        </Layer>
      )}
    </>
  );
};

export default Faucet;
