import React from "react";
import { Container } from "react-bootstrap";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer style={{ background: "#1c1c1c", color: "#fff", padding: "30px 0" }}>
      <Container className="text-center">
        <h5 style={{ marginBottom: "15px", fontWeight: "bold" }}>Contact Us</h5>
        <p style={{ marginBottom: "5px" }}>
          Email:{" "}
          <a
            href="mailto:gopikakandhan63@gmail.com"
            style={{ color: "#f1f1f1", textDecoration: "none" }}
          >
            gopikakandhan63@gmail.com
          </a>{" "}
          | Phone:{" "}
          <a
            href="tel:+918015210860"
            style={{ color: "#f1f1f1", textDecoration: "none" }}
          >
            +91 80152 10860
          </a>
        </p>
        <p style={{ marginBottom: "20px" }}>Address: Chennai, Tamil Nadu</p>

        {/* Social Media Icons */}
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
      </Container>
    </footer>
  );
};

export default Footer;
