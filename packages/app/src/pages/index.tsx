import { FC } from "react";
import FeaturedCards from "../components/featured-card";
import { Box, Heading, Text } from "grommet";
import Link from "next/link";

import TenderBox from "../components/tenderbox";
import { XLButton } from "../components/base";
import { normalizeColor } from "grommet/utils";
import { theme } from "../theme";

const Home: FC = () => {
  return (
    <Box>
      <Box justify="center" align="center" gap="medium">
        <Heading color={"white"} style={{ marginTop: "1em" }}>
          Tenderize
        </Heading>
        <Text color={"light-3"}>
          Don't just stake,
          <span
            style={{
              padding: "2px",
              background: "rgba(0, 0, 0, 0.3)",
              borderRadius: "4px",
              color: "#F8F8F8",
              fontWeight: 900,
            }}
          >
            {"Tenderize first "}
          </span>
        </Text>
        <Link href="/stakers/livepeer">
          <XLButton
            primary
            size="large"
            color="white"
            label="Open App"
            style={{ color: normalizeColor("brand", theme) }}
          />
        </Link>
      </Box>
      <Box flex fill justify="center" align="center">
        <TenderBox width="xlarge">
          <FeaturedCards />
        </TenderBox>
      </Box>
    </Box>
  );
};

export default Home;
