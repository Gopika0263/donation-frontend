import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import receive from "../assets/foodreceive.jpeg";

const ReceiverDashboard = () => {
  const { authAxios, user } = useAuth();
  const [availableDonations, setAvailableDonations] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchDonations = async () => {
    try {
      const availableRes = await authAxios.get("/donations");
      setAvailableDonations(availableRes.data);

      const claimsRes = await authAxios.get("/donations/my/claims");
      setMyClaims(claimsRes.data);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to fetch donations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [authAxios]);

  const handleClaim = async (donationId) => {
    setSuccess("");
    setError("");
    try {
      await authAxios.put(`/donations/${donationId}/claim`);
      setSuccess("Donation claimed successfully!");
      fetchDonations();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to claim donation.");
    }
  };

  const handleComplete = async (donationId) => {
    setSuccess("");
    setError("");
    try {
      await authAxios.put(`/donations/${donationId}/complete`);
      setSuccess("Donation marked as completed!");
      fetchDonations();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to complete donation.");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      style={{
        backgroundImage: `url(${receive})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <Container
        style={{
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          borderRadius: "15px",
          padding: "30px",
        }}
      >
        <h2>Receiver Dashboard</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <h3 className="mt-4">Available Donations</h3>
        {availableDonations.length === 0 ? (
          <Alert variant="info">No available donations at the moment.</Alert>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {availableDonations.map((donation) => (
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
                      Donor: {donation.donor?.name || "Unknown Donor"}
                    </Card.Text>
                    <Button
                      variant="primary"
                      onClick={() => handleClaim(donation._id)}
                    >
                      Claim Donation
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <h3 className="mt-5">My Claimed Donations</h3>
        {myClaims.length === 0 ? (
          <Alert variant="info">You haven't claimed any donations yet.</Alert>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {myClaims.map((donation) => (
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
                      Status: {donation.status}
                      <br />
                      Donor: {donation.donor?.name || "Unknown Donor"}
                    </Card.Text>
                    {donation.status === "delivered" && (
                      <Button
                        variant="success"
                        onClick={() => handleComplete(donation._id)}
                      >
                        Mark as Completed
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

export default ReceiverDashboard;
