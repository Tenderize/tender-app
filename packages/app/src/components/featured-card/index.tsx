import { Row, Col } from "react-bootstrap";
import TokenCard from "../token-card";
import { Link } from "rimble-ui";
import "./featuredCard.scss";
import stakers from "../../data/stakers";

export default function FeaturedCard() {
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
}
