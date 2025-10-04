import React from "react";
import { Row, Col, Button, Card, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import foodHome from "../assets/homep.mp4";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import "./HomePage.css";
import donatefood from "../assets/donateimage.png";
import foodfind from "../assets/findfood.png";
import tracking from "../assets/trackfood.png";
import "./Login.css";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

const HomePage = () => {
  const { user } = useAuth();

  // Intersection Observer for animation
  const { ref: impactRef, inView: impactInView } = useInView({
    triggerOnce: false,
    threshold: 0.3,
  });

  const { ref: featuresRef, inView: featuresInView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  return (
    <div>
      {/* Hero Section - EDGE TO EDGE VIDEO */}
      <div
        style={{
          width: "100%",
          height: "85vh",
          position: "unset",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          margin: 0,
          padding: 0,
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
            zIndex: -1,
          }}
        >
          <source src={foodHome} type="video/mp4" className="vediomine" />
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
                className="me-3 login-btn"
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
                  className="login-btn"
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
                  className="login-btn"
                >
                  Go to Receiver Dashboard
                </Button>
              )}

              {user.role === "admin" && (
                <Button
                  as={Link}
                  to="/admin-dashboard"
                  variant="info"
                  size="lg"
                  className="login-btn"
                >
                  Go to Admin Dashboard
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="my-5 text-center" ref={featuresRef}>
        <h2>Features</h2>
        <Row className="g-4 mt-3">
          <Col
            md={4}
            className={`feature-card ${featuresInView ? "in-view" : ""}`}
          >
            <Card className="dark-card">
              <Card.Img variant="top" src={donatefood} />
              <Card.Body>
                <Card.Title>Easy Donation</Card.Title>
                <Card.Text>Post surplus food easily.</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col
            md={4}
            className={`feature-card ${featuresInView ? "in-view" : ""}`}
          >
            <Card className="dark-card">
              <Card.Img variant="top" src={foodfind} />
              <Card.Body>
                <Card.Title>Find Food</Card.Title>
                <Card.Text>Locate available food nearby.</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col
            md={4}
            className={`feature-card ${featuresInView ? "in-view" : ""}`}
          >
            <Card className="dark-card">
              <Card.Img variant="top" src={tracking} className="gk" />
              <Card.Body>
                <Card.Title>Track Donations</Card.Title>
                <Card.Text>Real-time status tracking.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Impact Section */}
      <div id="impact" className="my-5 text-center" ref={impactRef}>
        <h2>Our Impact</h2>
        <Row className="mt-4 justify-content-center">
          <Col
            md={3}
            className={`impact-card ${impactInView ? "in-view" : ""}`}
          >
            <h3 className={impactInView ? "pulse-1200" : ""}>
              {impactInView ? <CountUp end={1200} duration={3} /> : 0}+
            </h3>
            <p>Meals Donated</p>
          </Col>

          <Col
            md={3}
            className={`impact-card ${impactInView ? "in-view" : ""}`}
          >
            <h3 className={impactInView ? "pulse-300" : ""}>
              {impactInView ? <CountUp end={300} duration={3} /> : 0}+
            </h3>
            <p>Donors</p>
          </Col>

          <Col
            md={3}
            className={`impact-card ${impactInView ? "in-view" : ""}`}
          >
            <h3 className={impactInView ? "pulse-500" : ""}>
              {impactInView ? <CountUp end={500} duration={3} /> : 0}+
            </h3>
            <p>Receivers</p>
          </Col>
        </Row>
      </div>

      {/* How It Works Section */}
      <div className="my-5">
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
      </div>

      {/* Testimonials Section */}
      <div className="my-5">
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
      </div>

      {/* Call to Action */}
      <div className="my-5 text-center">
        <h2>Join Us in Fighting Hunger</h2>
        <p>Be part of the movement. Donate or receive food today.</p>
        <Button as={Link} to="/register" variant="danger" size="lg">
          Get Involved
        </Button>
      </div>
      <footer
        className="botfooter"
        style={{
          background: "#1c1c1c",
          color: "#fff",
          
          textAlign: "center",
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          marginTop: "2100px",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <h5 style={{ marginBottom: "15px", fontWeight: "bold" }}>Contact Us</h5>
        <p style={{ marginBottom: "5px" }}>
          Email:{" "}
          <a
            href="mailto:foodDonation@gmail.com"
            style={{ color: "#f1f1f1", textDecoration: "none" }}
          >
            foodDonation@gmail.com
          </a>{" "}
          | Phone:{" "}
          <a
            href="tel:+9100000 0000"
            style={{ color: "#f1f1f1", textDecoration: "none" }}
          >
            +91 00000 00000
          </a>
        </p>
        <p style={{ marginBottom: "20px" }}>Address: Chennai, Tamil Nadu</p>

        <div style={{ fontSize: "1.5rem", marginBottom: "20px" }}>
          <a
            href="https://github.com/Gopika0263"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#fff", margin: "0 15px" }}
          >
            <FaGithub />
          </a>
          <a
            href="https://www.instagram.com/_kavidhai__kadal/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#fff", margin: "0 15px" }}
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.linkedin.com/in/gopika-k-1067642b9/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#fff", margin: "0 15px" }}
          >
            <FaLinkedin />
          </a>
        </div>

        <p style={{ fontSize: "14px", margin: 0 }}>
          © {new Date().getFullYear()} Food Donation App. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
