import { FC } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import styled from "styled-components";
import { Avatar, Button, Box, Card, CardBody, CardHeader } from "grommet";

type Props = {
  url: string;
  info: CardInfo;
  // provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider;
};

type CardInfo = {
  description: string;
  stakerAddress: string;
  title: string;
  available: boolean;
  apy: number;
  logo: string;
  symbol: string;
};

const TokenCard: FC<Props> = (props) => {
  const { url, info } = props;
  const logo = require("../../images/" + info.logo);

  const renderCard = () => {
    return (
      <TCard style={{ zIndex: 1 }}>
        <CardHeader flex direction="column">
          <Avatar size="medium" src={logo.default} style={{ margin: "1em auto 0" }} />
          <h3>{info.title}</h3>
        </CardHeader>
        <CardBody style={{ textTransform: "capitalize", textAlign: "center" }}>
          <div style={{ margin: "5 0" }}>
            <h5>
              <span className="percent">{info.apy}%</span>
            </h5>
          </div>
        </CardBody>
      </TCard>
    );
  };

  return (
    <>
      {info.available ? (
        <Link to={url} style={{ textDecoration: "none", display: "flex", flex: 1 }}>
          {renderCard()}
        </Link>
      ) : (
        renderCard()
      )}
    </>
  );
};

const TCard = styled(Card)`
  flex: 1;
  background: none;
  margin: 0 0 20px !important; // I don't feel like figuring out how to override it without this.
  text-decoration: none;
  box-shadow: none;
  color: white;
  &.disabled {
    cursor: default;
  }
`;

export default TokenCard;
