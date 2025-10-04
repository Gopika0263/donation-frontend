import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import foodlogin from "../assets/login.jpg";
import "./Login.css";

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
      const res = await register(name, email, password, role);
      // backend currently returns { msg: "User registered successfully" }
      // Accept both cases (msg only) and token+user (if backend later returns)
      if (res && (res.msg || res.token)) {
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        // fallback success
        alert("Registration complete. Please login.");
        navigate("/login");
      }
    } catch (err) {
      console.error("Register error:", err);
      if (!err.response) {
        setError("Network error — server not reachable.");
      } else {
        setError(
          err.response.data?.msg || err.message || "Registration failed."
        );
      }
    }
  };

  return (
   <div
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundImage: `url(${foodlogin})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}
>

      <Container
        className="mt-5"
        style={{
          maxWidth: "500px",
          backgroundColor: "rgba(232, 230, 230, 0.5)",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          marginTop: "80px",
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
              <option value="admin">admin</option>
            </Form.Select>
          </Form.Group>
<br></br>
          <Button variant="primary" type="submit" className="w-100 login-btn">
            Register
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default RegisterPage;
