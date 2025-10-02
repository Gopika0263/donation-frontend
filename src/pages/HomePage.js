import React from "react";
import { Container, Row, Col, Button, Card, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import foodHome from "../assets/homep.mp4";
import CountUp from "react-countup";
import "./HomePage.css";
import donatefood from "../assets/donateimage.png";
import foodfind from "../assets/findfood.png";
import tracking from "../assets/trackfood.png";
const HomePage = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <Container
        fluid
        style={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          padding: 0,
          margin: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <video
          autoPlay
          loop
          muted
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -999,
          }}
        >
          <source src={foodHome} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div style={{ marginBottom: "40px", textAlign: "center", zIndex: 1 }}>
          <h1 style={{ color: "white", textShadow: "2px 2px 5px black" }}>
            Hunger Relief and Food Security
          </h1>
          <p style={{ color: "white", textShadow: "1px 1px 3px black" }}>
            Empowering communities and nourishing lives
          </p>

          {!user ? (
            <>
              <Button
                as={Link}
                to="/register"
                variant="primary"
                size="lg"
                className="me-3"
              >
                Get Started (Register)
              </Button>
              <Button as={Link} to="/login" variant="outline-light" size="lg">
                Login
              </Button>
            </>
          ) : (
            <>
              {user.role === "donor" && (
                <Button
                  as={Link}
                  to="/create-donation"
                  variant="success"
                  size="lg"
                >
                  Donate Food
                </Button>
              )}
              {user.role === "receiver" && (
                <Button
                  as={Link}
                  to="/receiver-dashboard"
                  variant="info"
                  size="lg"
                >
                  Go to Receiver Dashboard
                </Button>
              )}
            </>
          )}
        </div>
      </Container>

      {/* Features Section */}
      <Container id="features" className="my-5 text-center">
        <h2>Features</h2>
        <Row className="g-4 mt-3">
          <Col md={4}>
            <Card className="dark-card">
              <Card.Img variant="top" src={donatefood} alt="Easy Donation" />
              <Card.Body>
                <Card.Title>Easy Donation</Card.Title>
                <Card.Text>
                  Post surplus food and help reduce waste easily.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="dark-card">
              <Card.Img variant="top" src={foodfind} alt="Find Food" />
              <Card.Body>
                <Card.Title>Find Food</Card.Title>
                <Card.Text>
                  Receivers can quickly locate available food nearby.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="dark-card">
              <Card.Img variant="top" src={tracking} alt="Track Donations" />
              <Card.Body>
                <Card.Title>Track Donations</Card.Title>
                <Card.Text>
                  Real-time status tracking for both donors and receivers.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Container id="impact" className="my-5 text-center">
        <h2>Our Impact</h2>
        <Row className="mt-4 justify-content-center">
          <Col md={3} className="impact-card mx-2">
            <h3>
              <CountUp end={1200} duration={3} />+
            </h3>
            <p>Meals Donated</p>
          </Col>
          <Col md={3} className="impact-card mx-2">
            <h3>
              <CountUp end={300} duration={3} />+
            </h3>
            <p>Donors</p>
          </Col>
          <Col md={3} className="impact-card mx-2">
            <h3>
              <CountUp end={500} duration={3} />+
            </h3>
            <p>Receivers</p>
          </Col>
        </Row>
      </Container>

      {/* How It Works Section */}
      <Container className="my-5">
        <h2 className="text-center">How It Works</h2>
        <Row className="mt-4">
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Step 1</Card.Title>
                <Card.Text>Register as a donor or receiver</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Step 2</Card.Title>
                <Card.Text>Post or claim available food</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Step 3</Card.Title>
                <Card.Text>Pickup and deliver safely</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Testimonials Section - Carousel */}
      <Container className="my-5">
        <h2 className="text-center mb-4">Testimonials</h2>
        <Carousel interval={5000} indicators={false}>
          <Carousel.Item>
            <Carousel.Caption className="testimonial-caption">
              <p>
                "This app helped me donate my leftover food to someone in need."
              </p>
              <small>- Donor A</small>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <Carousel.Caption className="testimonial-caption">
              <p>"I got meals for my family thanks to this amazing app."</p>
              <small>- Receiver B</small>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <Carousel.Caption className="testimonial-caption">
              <p>"Easy to use and really makes a difference!"</p>
              <small>- Donor C</small>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </Container>

      {/* Call to Action */}
      <Container className="my-5 text-center">
        <h2>Join Us in Fighting Hunger</h2>
        <p>Be part of the movement. Donate or receive food today.</p>
        <Button as={Link} to="/register" variant="danger" size="lg">
          Get Involved
        </Button>
      </Container>
    </div>
  );
};

export default HomePage;
