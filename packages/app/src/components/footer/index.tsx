import { FC } from "react";
import { Box, Text, Anchor, Footer } from "grommet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";

const logo = require("../../images/tenderizeLogo.svg");

const Foot: FC = () => {
  return (
    <Footer pad={{ horizontal: "100px", vertical: "5px" }}>
      <Box align="end" direction="row" gap="xsmall">
        <img width="120" src={logo.default} />
      </Box>
      <Text alignSelf="center" textAlign="center" size="xsmall" color="white">
        © Tenderize Me, inc. 2021
      </Text>
      <Box direction="row" gap="xxsmall" justify="center" align="center">
        <Anchor
          color="white"
          a11yTitle="Chat with us on Discord"
          href="#"
          icon={<FontAwesomeIcon icon={faDiscord} />}
        />
        <Anchor color="white" a11yTitle="Follow us on Twitter" href="#" icon={<FontAwesomeIcon icon={faTwitter} />} />
        <Anchor color="white" as="div" a11yTitle="Built on Tenderizer" href="#" label="Docs"></Anchor>
      </Box>
    </Footer>
  );
};

export default Foot;
