import { FC } from "react";

const hammer = require("../../images/hammer.svg");
const meat = require("../../images/meat.svg");

const HammerSteak: FC = () => {
  return (
    <div style={{
      position: "absolute",

    }}>
      <img id="hammer" width="240" src={hammer.default} alt="logo" />
      <img style={{marginLeft:"-100px", marginTop:"100px"}} id="meat" width="255" src={meat.default} alt="logo" />

    </div>
  );
};

export default HammerSteak;
