import { Anchor, Button, Header, Image, Box } from "grommet";
import { FC, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";

const Navbar: FC = () => {
  const [navBackground, setNavBackground] = useState(false);
  const navRef = useRef<boolean>(false);
  navRef.current = navBackground;

  useEffect(() => {
    const handleScroll = () => {
      const show = window.scrollY > 50;
      if (navRef.current !== show) {
        setNavBackground(show);
      }
    };
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Box>
      <Header justify="between" pad={{ horizontal: "xlarge", vertical: "xsmall" }}>
        <Link href="/">
          <Image width="150px" src={"/tenderizeLogo.svg"} alt="header logo" />
        </Link>
        <Box direction="row" gap="medium" align="center">
          <Anchor
            label="TenderTokens"
            href="#deployments"
            size="small"
            color="white"
            style={{textDecorationLine: "none"}}
          />
          <Anchor
            label="Learn More"
            href="#defi"
            size="small" 
            color="white"
            style={{textDecorationLine: "none"}}
          />
          <Anchor 
            label="Blog"
            href="#blog"
            size="small" 
            color="white"
            style={{textDecorationLine: "none"}}
          />
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
            style={{ paddingLeft: 0 }}
          />
            <a href="https://rinkeby.tenderize.me" target="_blank">
              <Button
                primary
                size="small"
                label="Open App"
                style={{ padding: "7px 10px", color: "white", borderColor: "white", borderRadius: 4 }}
              />
            </a>
        </Box>
      </Header>
    </Box>
  );
};

export default Navbar;
