import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  InputGroup,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import {
  FaUtensils,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaBuilding,
  FaClock,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import createDonationBg from "../assets/donate.jpg";
import "./CreateDonationPage.css";

const CreateDonationPage = () => {
  const [foodType, setFoodType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cookedTime, setCookedTime] = useState("");
  const [location, setLocation] = useState("");
  const [organization, setOrganization] = useState("");
  const [image, setImage] = useState(null);

  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [showToast, setShowToast] = useState(false);

  const { authAxios } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("foodType", foodType);
      formData.append("quantity", quantity);
      formData.append("pickupAddress", pickupAddress);
      formData.append("phone", phone);
      formData.append("expiry", expiry);
      formData.append("cookedTime", cookedTime);
      formData.append("location", location);
      formData.append("organization", organization);
      if (image) formData.append("image", image); // ✅ use 'image' state, not 'imageFile'

      const res = await authAxios.post("/donations", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setToastMessage("Donation created successfully!");
      setToastVariant("success");
      setShowToast(true);

      // ✅ navigate with the response data
      navigate("/donor-dashboard", {
        state: { newDonation: res.data.donation },
      });
    } catch (err) {
      setToastMessage(
        err.response?.data?.message || "Failed to create donation."
      ); // use 'message' from backend
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  return (
    <div className="donation-page">
      <div
        className="parallax-bg"
        style={{
          backgroundImage: `url(${createDonationBg})`,
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
      <Container className="position-relative">
        <Row className="justify-content-center">
          <Col lg={7} md={9}>
            <Card className="glass-card fade-slide-in p-4">
              <h2 className="text-center mb-4">Create New Donation</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
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
                    <option value="Cooked">Cooked</option>
                    <option value="Packed">Packed</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaUtensils />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="e.g., 10 servings"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaPhoneAlt />
                    </InputGroup.Text>
                    <Form.Control
                      type="tel"
                      placeholder="Phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Expiry</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaClock />
                    </InputGroup.Text>
                    <Form.Control
                      type="datetime-local"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      required
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Cooked Time</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaClock />
                    </InputGroup.Text>
                    <Form.Control
                      type="datetime-local"
                      value={cookedTime}
                      onChange={(e) => setCookedTime(e.target.value)}
                      required
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaMapMarkerAlt />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Enter landmark / area"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Organization</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaBuilding />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Hotel / Restaurant..."
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Pickup Address</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaMapMarkerAlt />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Full pickup address"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      required
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Upload Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </Form.Group>

                <Button type="submit" className="w-100" variant="primary">
                  Create Donation
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>

        <ToastContainer className="p-3" position="top-end">
          <Toast
            show={showToast}
            bg={toastVariant}
            onClose={() => setShowToast(false)}
            delay={4000}
            autohide
          >
            <Toast.Body>{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
    </div>
  );
};

export default CreateDonationPage;
