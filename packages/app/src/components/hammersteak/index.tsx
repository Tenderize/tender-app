import { FC } from "react";

const hammer = require("../../images/hammer.svg");
const meat = require("../../images/meat.svg");

const HammerSteak: FC = () => {
  return (
    <div className="wrapper">
      <img id="meat" width="150" src={meat.default} alt="logo" />

      <img id="hammer" width="190" src={hammer.default} alt="logo" />
    </div>
  );
};

export default HammerSteak;
