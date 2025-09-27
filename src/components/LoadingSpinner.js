import React from "react";
import { Spinner, Container } from "react-bootstrap";

const LoadingSpinner = () => (
  <Container
    className="d-flex justify-content-center align-items-center"
    style={{ minHeight: "60vh" }}
  >
    <Spinner animation="border" role="status" />
  </Container>
);

export default LoadingSpinner;
