import { FC } from "react";
import { Box, Text, Anchor, Footer } from "grommet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";

const logo = require("../../images/tenderizeLogo.svg");

const Foot: FC = () => {
  return (
    <Footer pad={{ horizontal: "100px", vertical: "5px" }}>
      <Box align="end" direction="row" gap="xsmall">
        <img width="120" height="34.97" src={logo.default} alt="footer logo" />
      </Box>
      <Text alignSelf="center" textAlign="center" size="xsmall" color="white">
        © Tenderize Me, inc. 2021
      </Text>
      <Box direction="row" gap="xxsmall" justify="center" align="center">
        <Anchor
          color="white"
          a11yTitle="Chat with us on Discord"
          href="https://discord.gg/WXR5VBttP5"
          icon={<FontAwesomeIcon icon={faDiscord} />}
          target="_blank"
        />
        <Anchor
          color="white"
          a11yTitle="Follow us on Twitter"
          href="https://twitter.com/tenderize_me"
          icon={<FontAwesomeIcon icon={faTwitter} />}
          target="_blank"
        />
        <Anchor color="white" as="div" a11yTitle="Built on Tenderizer" href="#" label="Docs"></Anchor>
      </Box>
    </Footer>
  );
};

export default Foot;
