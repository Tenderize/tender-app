import { FC } from "react";
import {Box} from 'grommet'
const hammer = require("../../images/hammer.svg");
const meat = require("../../images/meat.svg");

const HammerSteak: FC = () => {
  return (
    <Box fill flex direction="row" align='center' justify='start' style={{
      position: "absolute"
    }}>
      <img id="hammer" width="240" src={hammer.default} alt="logo" />
      <img style={{marginLeft:"-130px", marginTop:"100px"}} id="meat" width="255" src={meat.default} alt="logo" />
    </Box>
  );
};

export default HammerSteak;
