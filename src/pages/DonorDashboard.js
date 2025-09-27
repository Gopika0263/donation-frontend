import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import donationBg from "../assets/donation_dash.jpeg"; // 👈 import your image

const DonorDashboard = () => {
  const { authAxios } = useAuth();
  const [myDonations, setMyDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchMyDonations = async () => {
    try {
      const res = await authAxios.get("/donations/my/donations");
      setMyDonations(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to fetch your donations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDonations();
  }, []);

  const handlePickup = async (id) => {
    setError("");
    setSuccess("");
    try {
      await authAxios.put(`/donations/${id}/pickup`);
      setSuccess("Donation marked as picked up!");
      fetchMyDonations();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to mark as picked up.");
    }
  };

  const handleDeliver = async (id) => {
    setError("");
    setSuccess("");
    try {
      await authAxios.put(`/donations/${id}/deliver`);
      setSuccess("Donation marked as delivered!");
      fetchMyDonations();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to mark as delivered.");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div
      style={{
        backgroundImage: `url(${donationBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Container
        className="mt-4 bg-light p-4 rounded shadow"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.85)", // semi-transparent
          backdropFilter: "blur(4px)",
          // nice blur effect
        }}
      >
        <h2>Donor Dashboard</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {myDonations.length === 0 ? (
          <Alert variant="info">You have not created any donations yet.</Alert>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {myDonations.map((donation) => (
              <Col key={donation._id}>
                <Card>
                  <Card.Body>
                    <Card.Title>{donation.foodType}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Quantity: {donation.quantity}
                    </Card.Subtitle>
                    <Card.Text>
                      Pickup Address: {donation.pickupAddress}
                      <br />
                      Status: <strong>{donation.status}</strong>
                      {donation.receiver && (
                        <>
                          <br />
                          Claimed by: {donation.receiver.name || "Unknown"}
                        </>
                      )}
                    </Card.Text>

                    {donation.status === "claimed" && (
                      <Button
                        variant="warning"
                        onClick={() => handlePickup(donation._id)}
                      >
                        Mark as Picked Up
                      </Button>
                    )}

                    {donation.status === "pickedUp" && (
                      <Button
                        variant="success"
                        onClick={() => handleDeliver(donation._id)}
                      >
                        Mark as Delivered
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default DonorDashboard;
