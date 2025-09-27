import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import foodlogin from "../assets/login.jpeg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      if (user?.role === "donor") navigate("/donor-dashboard");
      else if (user?.role === "receiver") navigate("/receiver-dashboard");
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid email or password.");
    }
  };

  if (user) {
    if (user.role === "donor") navigate("/donor-dashboard");
    else if (user.role === "receiver") navigate("/receiver-dashboard");
    else navigate("/");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${foodlogin})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container
        style={{
          maxWidth: "400px",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        <h2>Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Login
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default LoginPage;
