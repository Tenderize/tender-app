import { FC } from "react";
import { Box, Text, Anchor, Footer } from "grommet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { useIsTouchDevice } from "../../hooks/useIsTouchDevice";

export const Foot: FC = () => {
  const isTouchDevice = useIsTouchDevice();
  return (
    <Footer pad={{ horizontal: isTouchDevice ? "50px" : "100px", vertical: "5px" }} margin={{ top: "small" }}>
      {!isTouchDevice && (
        <Box align="end" direction="row" gap="xsmall">
          <img width="120" height="34.97" src={"/tenderizeLogo.svg"} alt="footer logo" />
        </Box>
      )}
      <Text alignSelf="center" textAlign="center" size="xsmall" color="white">
        © Tenderize Labs Ltd. 2021
      </Text>
      <Box direction="row" gap="xxsmall" justify="center" align="center">
        <Anchor
          color="white"
          title="Chat with us on Discord"
          a11yTitle="Chat with us on Discord"
          href="https://discord.gg/WXR5VBttP5"
          icon={<FontAwesomeIcon icon={faDiscord} />}
          target="_blank"
        />
        <Anchor
          color="white"
          title="Follow us on Twitter"
          a11yTitle="Follow us on Twitter"
          href="https://twitter.com/tenderize_me"
          icon={<FontAwesomeIcon icon={faTwitter} />}
          target="_blank"
        />
        <Anchor
          color="white"
          title="Documentation"
          a11yTitle="Documentation"
          href="https://docs.tenderize.me"
          icon={<FontAwesomeIcon icon={faBook} />}
          target="_blank"
        />
      </Box>
    </Footer>
  );
};
