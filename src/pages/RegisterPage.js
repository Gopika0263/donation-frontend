import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import foodlogin from "../assets/login.jpeg";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("donor");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(name, email, password, role);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed.");
    }
  };

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
        className="mt-5"
        style={{
          maxWidth: "500px",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        <h2>Register</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

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
              placeholder="Choose a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formRole">
            <Form.Label>Register as</Form.Label>
            <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="donor">Donor</option>
              <option value="receiver">Receiver</option>
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Register
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default RegisterPage;
