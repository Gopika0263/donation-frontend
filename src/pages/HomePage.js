import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import foodHome from "../assets/food_Home.jpg";
import foodabout from "../assets/about.jpg";
import foodfeature from "../assets/features.jpeg";
const HomePage = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <Container
        fluid
        style={{
          backgroundImage: `url(${foodHome})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 0,
          margin: 0,
        }}
      >
        <div
          className="p-5 mb-4 rounded-3 text-center"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(4px)",
          }}
        >
          <h1>Welcome to the Food Donation App!</h1>
          <p className="lead">
            Connecting those who have food to share with those who need it.
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
              <Button as={Link} to="/login" variant="outline-primary" size="lg">
                Login
              </Button>
            </>
          ) : (
            <>
              <p>
                You are logged in as <strong>{user.name}</strong> ({user.role}).
              </p>
              {user.role === "donor" && (
                <Button as={Link} to="/donor-dashboard" variant="info">
                  Go to Donor Dashboard
                </Button>
              )}
              {user.role === "receiver" && (
                <Button as={Link} to="/receiver-dashboard" variant="info">
                  Go to Receiver Dashboard
                </Button>
              )}
            </>
          )}
        </div>
      </Container>

      {/* Features Section */}
      {/* Features Section */}
      <Container id="features" className="my-5">
        <h2>Features</h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          {/* Left Text */}
          <div style={{ flex: "2 1 400px" }}>
            <p>
              Our Food Donation App is designed specifically for urban cities to
              make food sharing simple and efficient. Donors can easily register
              and post available food, while receivers can quickly find nearby
              donations that suit their needs. With secure login and
              user-friendly dashboards, both donors and receivers can manage
              their activities effortlessly. The app ensures that donations
              reach the right people on time, reducing food wastage and helping
              the community.
            </p>
            <p>
              The app includes real-time notifications, location-based matching,
              and donation tracking to keep users informed about the status of
              each donation. It also offers a contact and support system for
              assistance whenever needed. With a clean, responsive interface,
              the app provides an easy and reliable platform for urban citizens
              to contribute and receive food efficiently, making urban food
              sharing organized and impactful.
            </p>
          </div>

          {/* Right Image */}
          <div style={{ flex: "1 1 300px" }}>
            <img
              src={foodfeature}
              alt="Features"
              style={{ width: "100%", borderRadius: "10px" }}
            />
          </div>
        </div>
      </Container>

      {/* About Section */}
      <Container id="about" className="my-5">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          {/* Left Image */}
          <div style={{ flex: "1 1 300px" }}>
            <img
              src={foodabout}
              alt="About Us"
              style={{ width: "100%", borderRadius: "10px" }}
            />
          </div>

          {/* Right Text */}

          <div style={{ flex: "2 1 400px" }}>
            <h2>About Us</h2>

            <br></br>
            <p>
              Welcome to the <strong>Food Donation App</strong>! Our mission is
              to reduce food waste and help those in need by connecting donors
              and receivers. Donors can share surplus food, and receivers can
              easily request and collect food.
            </p>
            <p>
              In urban cities, food wastage is a major problem, while many
              people still struggle with hunger. This app aims to connect people
              or restaurants with excess food to those in need, ensuring food is
              donated instead of wasted. The app provides a platform for donors
              and receivers to easily communicate and arrange food donations.
            </p>
          </div>
        </div>
      </Container>

      {/* Contact Section */}
    </div>
  );
};

export default HomePage;
