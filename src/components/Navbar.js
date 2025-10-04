import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { animateScroll as scroll } from "react-scroll";
import { useNavigate, useLocation } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import "./AppNavbar.css"; // Import the CSS file for styling

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const linkStyle = {
    cursor: "pointer",
    color: "white",
    fontWeight: "bold",
    fontSize: "1.1rem",
    marginRight: "1rem",
    transition: "color 0.3s",
  };

 /* AppNavbar.css or your CSS file */



  const scrollToTop = () => {
    navigate("/");
    setTimeout(() => scroll.scrollToTop({ duration: 500 }), 100);
  };

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const elem = document.getElementById(id);
        if (elem) scroll.scrollTo(elem.offsetTop - 70, { duration: 500 });
      }, 100);
    } else {
      const elem = document.getElementById(id);
      if (elem) scroll.scrollTo(elem.offsetTop - 70, { duration: 500 });
    }
  };

  return (
    <Navbar
      variant="variant"
      fontWeight="bold"
      fontSize="5rem"
      expand="lg"
      sticky="top"
      style={{
        backdropFilter: "blur(16px)",
        backgroundColor: "rgba(52, 50, 50, 0.8)",
      }}
    >
      <Container>
        <Navbar.Brand
          onClick={scrollToTop}
          style={{
            cursor: "pointer",
            color: "#FFD700",
            fontWeight: "bold",
            fontSize: "1.8rem",
            letterSpacing: "1px",
            textShadow: "1px 1px 6px rgba(0,0,0,0.8)",
          }}
        >
          Food Donation
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user?.role === "donor" && (
              <>
                <LinkContainer to="/donor-dashboard">
                  <Nav.Link className="navlink-white">Donor Dashboard</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/create-donation">
                  <Nav.Link className="navlink-white">Create Donation</Nav.Link>
                </LinkContainer>
              </>
            )}
            {user?.role === "receiver" && (
              <LinkContainer to="/receiver-dashboard">
                <Nav.Link className="navlink-white">
                  Receiver Dashboard
                </Nav.Link>
              </LinkContainer>
            )}
            {user?.role === "admin" && (
              <LinkContainer to="/admin-dashboard">
                <Nav.Link className="navlink-white">Admin Dashboard</Nav.Link>
              </LinkContainer>
            )}
          </Nav>

          <Nav>
            {user ? (
              <>
                <Navbar.Text
                  className="me-3"
                  style={{ color: "white", fontWeight: "bold" }}
                >
                  Signed in as: <strong>{user.name}</strong> ({user.role})
                </Navbar.Text>
                <Button variant="light" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link onClick={scrollToTop} style={linkStyle}>
                  Home
                </Nav.Link>
                <Nav.Link
                  onClick={() => scrollToSection("features")}
                  style={linkStyle}
                >
                  Features
                </Nav.Link>

                {/* Buttons instead of links */}
                <LinkContainer to="/login">
                  <Button
                    variant="outline-light"
                    className="me-2"
                    style={{ fontWeight: "bold" }}
                  >
                    Login
                  </Button>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Button variant="light" style={{ fontWeight: "bold" }}>
                    Register
                  </Button>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
