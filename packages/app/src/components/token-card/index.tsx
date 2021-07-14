import { FC } from "react";
import { Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Button, Avatar } from "rimble-ui";
import classNames from "classnames";
import styled from "styled-components";


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
  const ctaText = () => {
    return info.available ? "Discover" : "Coming Soon";
  };

  const renderCard = () => {
    return (
      <TCard className={classNames({ disabled: !info.available })} style={{ marginTop: "1em", zIndex: 1 }}>
        <Avatar size="large" src={logo.default} style={{ margin: "1em auto 0" }} />
        <Card.Body style={{ textTransform: "capitalize", textAlign: "center" }}>
          <Card.Title>
            <h2>{info.title}</h2>
          </Card.Title>

          <div style={{ margin: "10 0" }}>
            <h3>
              <span className="percent">{info.apy}%</span>
            </h3>
          </div>

          <Button className="cta" disabled={!info.available}>
            {ctaText()}
          </Button>
        </Card.Body>
      </TCard>
    );
  };

  return (
    <Col xs={{ span: 12 }} sm={{ span: 6 }} md={{ span: 4 }} lg={{ span: 4 }}>
      {info.available ? (
        <Link to={url} className="card-link">
          {renderCard()}
        </Link>
      ) : (
        renderCard()
      )}
    </Col>
  );
};

const TCard = styled(Card)`
  z-index: 0;
  transform: scale(1);
  transition-duration: 0.2s;
  margin: 0 0 20px !important; // I don't feel like figuring out how to override it without this.
  text-decoration: none;
  &:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(78, 102, 222, 0.5);
    transform: scale(1.05);
    transition-duration: 0.2s;
  }

  &.disabled {
    cursor: default;
  }

  &.disabled:hover {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06);
    transform: scale(1.01);
    transition-duration: 0.1s;
  }

  .cta {
    width: 80%;
    margin-top: 10px;
  }
`;

export default TokenCard;
