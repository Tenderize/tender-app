import { FC } from "react";
import { Anchor } from "grommet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";

export const MobileHeader: FC = () => {
  return (
    <div style={{ alignSelf: "flex-end", paddingTop: "1rem" }}>
      <Anchor
        size="large"
        color="white"
        a11yTitle="Chat with us on Discord"
        href="https://discord.gg/WXR5VBttP5"
        icon={<FontAwesomeIcon icon={faDiscord} />}
        target="_blank"
        style={{ paddingLeft: 0 }}
      />
      <Anchor
        size="large"
        color="white"
        a11yTitle="Follow us on Twitter"
        href="https://twitter.com/tenderize_me"
        icon={<FontAwesomeIcon icon={faTwitter} />}
        target="_blank"
      />
    </div>
  );
};
