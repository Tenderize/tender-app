import { FC, useState } from "react";
import { useContractFunction } from "@usedapp/core";
import { contracts } from "@tender/contracts";
import { Box, Button, Text, Heading, Layer, Card, CardHeader, CardBody } from "grommet";

type props = {
  symbol: string;
  name: string;
};

const Faucet: FC<props> = ({ symbol, name }) => {
  const [show, setShow] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { state, send } = useContractFunction(contracts.livepeer.faucet, "request");

  const requestTokens = () => {
    send();
  };
  return (
    <>
      <Button plain onClick={() => setShow(true)} label="Faucet" />
      {show && (
        <Layer animation="fadeIn" onEsc={() => setShow(false)} onClickOutside={() => setShow(false)}>
          <Card pad="medium" height="medium" width="medium">
            <CardHeader>
              <Heading>{symbol} Faucet</Heading>
            </CardHeader>
            <CardBody>
              <Box width="large" gap="small">
                <Text>{`Get some testnet ${symbol} and ETH (you need ETH to get ${symbol})`}</Text>
                <Button primary color="brand" onClick={requestTokens} label={`Get ${symbol}`} />
                <Button
                  primary
                  color="brand"
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
