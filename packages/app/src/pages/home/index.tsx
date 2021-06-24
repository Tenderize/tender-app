import React from "react";
import FeaturedCards from "../../components/featured-card/";
import HammerSteak from "../../components/hammersteak";
import { Card, Heading, Text, Image, Icon } from "rimble-ui";
import { Container, Row, Col } from "react-bootstrap";
import "./home.scss";

export default function Home() {
  return (
    <>
      <Container>
        <Row className="app-header">
          <Col
            md={{ span: 12 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Heading className="title" style={{ marginTop: "1em" }}>
              Don&apos;t just stake me,
            </Heading>
            <Heading className="title">
              <span style={{ color: "#4E66DE" }}>Tenderize</span> me first
            </Heading>
            <Text className="subtext" style={{ marginTop: "1em", fontWeight: "600" }}>
              Making
              <span style={{ color: "#4E66DE", fontWeight: 900 }}>{" stake easier "}</span>
              to chew.
            </Text>
            <HammerSteak></HammerSteak>
          </Col>
        </Row>

        <FeaturedCards /*provider={this.props.provider}*/ />

        <Row style={{ marginTop: "6em" }}>
          <Col lg={{ span: 6 }} md={{ span: 6 }}>
            <Image src="potionHero.svg"></Image>
          </Col>
          <Col lg={{ span: 6 }} md={{ span: 6 }}>
            <Heading as={"h4"} style={{ margin: "15% 10%", lineHeight: 2 }}>
              Tenderize makes it easier to participate in decentralised protocols and
              <span style={{ fontWeight: 800 }}> earn staking rewards</span>.
            </Heading>
          </Col>
        </Row>

        <Row style={{ marginTop: "6em", marginBottom: "6em" }}>
          <Col>
            <Card>
              <Heading as={"h4"} style={{ margin: "3em 3em 0em 3em" }}>
                <Row className="step">
                  <Col className="step-label" sm={{ span: 12 }} md={{ span: 3 }} lg={{ span: 2 }}>
                    <Icon name="KeyboardArrowRight" color="#4e66de" size="60" aria-label="Bullet" />
                  </Col>
                  <Col className="step-text" sm={{ span: 12 }} md={{ span: 9 }} lg={{ span: 10 }}>
                    Deposit your stake to tenderize it and earn rewards that are automatically reinvested.
                  </Col>
                </Row>
                <Row className="step">
                  <Col className="step-label" sm={{ span: 12 }} md={{ span: 3 }} lg={{ span: 2 }}>
                    <Icon name="KeyboardArrowRight" color="#4e66de" size="60" aria-label="Bullet" />
                  </Col>
                  <Col className="step-text" sm={{ span: 12 }} md={{ span: 9 }} lg={{ span: 10 }}>
                    Receive tender tokens that represent your stake and rewards.
                  </Col>
                </Row>
                <Row className="step">
                  <Col className="step-label" sm={{ span: 12 }} md={{ span: 3 }} lg={{ span: 2 }}>
                    <Icon name="KeyboardArrowRight" color="#4e66de" size="60" aria-label="Bullet" />
                  </Col>
                  <Col className="step-text" sm={{ span: 12 }} md={{ span: 9 }} lg={{ span: 10 }}>
                    Withdraw your stake whenever, or use your tender tokens as you would any other: transfer, exchange,
                    collateralize, etc.
                  </Col>
                </Row>
              </Heading>
            </Card>
          </Col>
        </Row>

        <Row style={{ margin: "6em 0" }}>
          <Col lg={{ span: 12 }}>
            <Image src="friends.svg" style={{ width: "100%" }}></Image>
          </Col>
        </Row>
      </Container>
    </>
  );
}
