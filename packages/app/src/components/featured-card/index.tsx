import { FC } from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "rimble-ui";

import TokenCard from "../token-card";
import "./featuredCard.scss";
import stakers from "../../data/stakers";

const FeaturedCard: FC = () => {
  const cards = [];
  let key: string;
  for (key in stakers) {
    cards.push(
      <TokenCard
        // provider={{}}
        info={stakers[key]}
        url={key}
        key={key}
      />
    );
  }
  return (
    <>
      <Row>
        <Col className="explore" md={{ span: 2, offset: 10 }}>
          <Link color="#a8b7f0" className="coming-soon">
            More coming soon
          </Link>
        </Col>
      </Row>
      <Row>{cards}</Row>
    </>
  );
};

export default FeaturedCard;
