import { FC } from "react";
import "./background.scss";

const Background: FC = () => {
  return (
    <>
      <div className="background"></div>
      <div className="bg-container">
        <div className="bg-inner"></div>
      </div>
    </>
  );
};

export default Background;
