import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link as ScrollLink, animateScroll as scroll } from "react-scroll";
import { useNavigate, useLocation } from "react-router-dom";

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const linkStyle = {
    cursor: "pointer",
    color: "white",
    marginRight: "1rem",
    transition: "color 0.3s",
  };

  const activeLinkStyle = {
    color: "yellow",
    fontWeight: "bold",
    borderBottom: "2px solid yellow",
  };

  const scrollToTop = () => {
    navigate("/");
    setTimeout(() => scroll.scrollToTop({ duration: 500 }), 100);
  };

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        scroll.scrollTo(document.getElementById(id).offsetTop - 70, {
          duration: 500,
        });
      }, 100);
    } else {
      scroll.scrollTo(document.getElementById(id).offsetTop - 70, {
        duration: 500,
      });
    }
  };

  return (
    <Navbar
      variant="dark"
      expand="lg"
      sticky="top"
      style={{
        backdropFilter: "blur(8px)", // Blur effect
        backgroundColor: "#333", // Solid dark background (change as you want)
      }}
    >
      <Container>
        <Navbar.Brand style={{ cursor: "pointer" }} onClick={scrollToTop}>
          Food Donation
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user?.role === "donor" && (
              <>
                <LinkContainer to="/donor-dashboard">
                  <Nav.Link>Donor Dashboard</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/create-donation">
                  <Nav.Link>Create Donation</Nav.Link>
                </LinkContainer>
              </>
            )}
            {user?.role === "receiver" && (
              <LinkContainer to="/receiver-dashboard">
                <Nav.Link>Receiver Dashboard</Nav.Link>
              </LinkContainer>
            )}

            {user?.role === "admin" && (
              <LinkContainer to="/admin-dashboard">
                <Nav.Link>Admin Dashboard</Nav.Link>
              </LinkContainer>
            )}
          </Nav>

          <Nav>
            {user ? (
              <>
                <Navbar.Text className="me-3">
                  Signed in as: <strong>{user.name}</strong> ({user.role})
                </Navbar.Text>
                <Button variant="outline-light" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <LinkContainer to="/">
                  <Nav.Link onClick={scrollToTop} style={linkStyle}>
                    Home
                  </Nav.Link>
                </LinkContainer>

                <Nav.Link
                  onClick={() => scrollToSection("features")}
                  style={linkStyle}
                >
                  Features
                </Nav.Link>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>Register</Nav.Link>
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
