import { FC } from "react";
import { Card } from "react-bootstrap";

type Props = {
  color: string;
  title: string;
  text: string;
};

const InfoCard: FC<Props> = ({ color = "primary", title = "", text = "" }) => {
  return (
    <>
      <Card
        bg={color}
        text={color?.toLowerCase() === "light" ? "dark" : "white"}
        style={{ width: "18rem" }}
        className="mb-2"
      >
        <Card.Body>
          <Card.Title>{title} </Card.Title>
          <Card.Text color="primary">
            <span style={{ color: "white", fontSize: "1rem" }}>{text}</span>
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
};

export default InfoCard;
