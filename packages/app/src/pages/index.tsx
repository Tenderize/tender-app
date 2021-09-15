import { FC } from "react";
import { Box, Heading, Text } from "grommet";
import Link from "next/link";
import { GetServerSideProps } from "next";

import FeaturedCards from "../components/featured-card";
import TenderBox from "../components/tenderbox";
import { XLButton } from "../components/base";
import { normalizeColor } from "grommet/utils";
import { theme } from "../theme";
import { TenderizerDaysType, GetTenderizerDays } from "../queries";
import { apolloClient } from "../config";

const Home: FC<{ data: TenderizerDaysType | null }> = ({ data }) => {
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
          <FeaturedCards data={data} />
        </TenderBox>
      </Box>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Cache-Control", `public, s-maxage=${60 * 60}, stale-while-revalidate=${60 * 60 * 2}`);

  const monthAgo = getUnixTimestampMonthAgo();
  const { data } = await apolloClient.query({
    query: GetTenderizerDays,
    variables: { from: monthAgo },
  });

  return {
    props: {
      data,
    },
  };
};

const getUnixTimestampMonthAgo = () => {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  d.setHours(0, 0, 0, 0);
  return d.getTime() / 1000;
};

export default Home;
