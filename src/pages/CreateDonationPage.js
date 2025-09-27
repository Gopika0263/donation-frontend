import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import createDonationBg from "../assets/donate.jpg"; // 👈 your image

const CreateDonationPage = () => {
  const [foodType, setFoodType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { authAxios } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await authAxios.post("/donations", { foodType, quantity, pickupAddress });
      setSuccess("Donation created successfully!");
      navigate("/donor-dashboard");
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          "Failed to create donation. Please try again."
      );
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${createDonationBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.85)", // 👈 glass effect
          backdropFilter: "blur(6px)",
          padding: "30px",
          borderRadius: "15px",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
      >
        <h2 className="mb-4 text-center">Create New Donation</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formFoodType">
            <Form.Label>Food Type</Form.Label>
            <Form.Select
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              required
            >
              <option value="">Select Food Type</option>
              <option value="Baby Food">Baby Food</option>
              <option value="Elderly Food">Elderly Food</option>
              <option value="Cooked Meals">Cooked Meals</option>
              <option value="Fresh Produce">Fresh Produce</option>
              <option value="Canned Goods">Canned Goods</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formQuantity">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g., 10 servings, 5 kg, 3 boxes"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPickupAddress">
            <Form.Label>Pickup Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter full pickup address"
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              required
            />
          </Form.Group>

          <div className="text-center">
            <Button variant="primary" type="submit" size="lg">
              Create Donation
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateDonationPage;
