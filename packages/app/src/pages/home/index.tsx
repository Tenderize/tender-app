import { FC } from "react";
import FeaturedCards from "../../components/featured-card/";
import HammerSteak from "../../components/hammersteak";
import { Box, Grid, Main, Heading, Text, Button } from "grommet";

const Home: FC = () => {
  return (
    <Box flex fill overflow="hidden">
      <HammerSteak/>
      <Grid
        fill
        rows={["small", "medium"]}
        columns={["1/5", "4/5"]}
        gap="small"
        areas={[
          { name: "main", start: [0, 0], end: [1, 0] },
          { name: "fill", start: [0, 1], end: [0, 1] },
          { name: "feature", start: [1, 1], end: [1, 1] },
        ]}
      >
        <Main gridArea="main"flex justify="center" align="center">
            <Heading  color={"white"} style={{ marginTop: "1em" }}>
              Tenderize
            </Heading>
            <Text color={"light-3"}>
              Don't just stake,
              <span style={{ color: "#F8F8F8", fontWeight: 900 }}>{" Tenderize first "}</span>
            </Text>
            <Button label="Open App"></Button>
        </Main>
        <Box gridArea="fill"  />
        <Box gridArea="feature" className="blur-box">
        <FeaturedCards /* provider={this.props.provider} */ />
        </Box>
      </Grid>
    </Box>
  );
};

export default Home;
