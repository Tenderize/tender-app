import { FC } from "react";
import { Link } from "react-router-dom";
import FeaturedCards from "../../components/featured-card/";
import { Box, Heading, Text, Button } from "grommet";
import TenderBox from "../../components/tenderbox";
import { XLButton } from '../../components/base'
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
        <Link to="/stakers/livepeer">
          <XLButton size="large" primary color="white" label="Open App" style={{color:"#4E66DE"}} />
        </Link>
      </Box>
      <Box flex fill justify="center" align="center">
        <TenderBox width="large">
          <FeaturedCards /* provider={this.props.provider} */ />
        </TenderBox>
      </Box>
    </Box>
  );
};

export default Home;
