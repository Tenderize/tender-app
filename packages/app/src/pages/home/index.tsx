import { FC } from "react";
import FeaturedCards from "../../components/featured-card/";
import { Box, Grid, Main, Heading, Text, Button } from "grommet";
import TenderBox from '../../components/tenderbox'
import styled from 'styled-components'
const MyStyledButton = styled(Button)`
  font-weight: bold;
  background-color: #FFFFFF;
  color: #4E66DE;
  border: none;
  width: 270px;
  height: 70px;
  border-radius: none;
`;


const Home: FC = () => {
  return (
    <>
    <Box>
      <Grid
        fill
        rows={["medium", "flex"]}
        columns={["5/5"]}
        gap="small"
        areas={[
          { name: "main", start: [0, 0], end: [1, 0] },
          { name: "feature", start: [0, 1], end: [1, 1] },
        ]}
      >
        <Main gridArea="main" justify="center" align="center" gap="medium">
            <Heading  color={"white"} style={{ marginTop: "1em" }}>
              Tenderize
            </Heading>
            <Text color={"light-3"}>
              Don't just stake,
              <span style={{ color: "#F8F8F8", fontWeight: 900 }}>{" Tenderize first "}</span>
            </Text>
            <MyStyledButton label="Open App" />
        </Main>
        <Box gridArea="feature" flex fill justify="center" align="center">
        <TenderBox flex width="large">
          <FeaturedCards /* provider={this.props.provider} */ />
        </TenderBox>
        </Box>
      </Grid>
    </Box>
    </>
  );
};

export default Home;
