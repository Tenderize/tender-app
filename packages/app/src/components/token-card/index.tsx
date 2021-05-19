import { Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Button, Avatar } from "rimble-ui";
import classNames from "classnames";
import "./tokenCard.scss";

type TokenCardProps = {
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

export default function TokenCard(props:TokenCardProps) {
    const { url, info } = props;
    const logo = require("../../images/" + info.logo);
    const ctaText = () => {
        return info.available ? "Discover" : "Coming Soon";
    };

    const renderCard = () => {
        return (
        <Card
            className={classNames({ disabled: !info.available })}
            style={{ marginTop: "1em", zIndex: 1 }}
        >
            <Avatar size="large" src={logo.default} style={{ margin: "1em auto 0" }} />
            <Card.Body
            style={{ textTransform: "capitalize", textAlign: "center" }}
            >
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
        </Card>
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
  
}