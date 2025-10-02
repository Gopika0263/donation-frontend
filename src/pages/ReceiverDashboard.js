import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import receive from "../assets/foodreceive.jpeg";

import { FaUtensils, FaMapMarkerAlt, FaUserAlt, FaClock } from "react-icons/fa";

const ReceiverDashboard = () => {
  const { authAxios } = useAuth();
  const [availableDonations, setAvailableDonations] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

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

  if (loading) return <LoadingSpinner />;

  // Filter donations based on status and search
  const filteredDonations = (donations) =>
    donations
      .filter((donation) => {
        const searchMatch =
          donation.foodType?.toLowerCase().includes(searchText.toLowerCase()) ||
          donation.pickupAddress
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) ||
          donation.location?.toLowerCase().includes(searchText.toLowerCase()) ||
          donation.donor?.name
            ?.toLowerCase()
            .includes(searchText.toLowerCase());

        const statusMatch =
          statusFilter === "all" || donation.status === statusFilter;

        return searchMatch && statusMatch;
      })
      .sort((a, b) => {
        if (sortBy === "newest")
          return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === "oldest")
          return new Date(a.createdAt) - new Date(b.createdAt);
        return 0;
      });

  // 2️⃣ Delivered donations filter
  const deliveredDonations = filteredDonations(myClaims).filter(
    (d) => d.status === "delivered"
  );
  const claimedDonations = filteredDonations(myClaims).filter(
    (d) => d.status === "claimed"
  );
  const completedDonations = filteredDonations(myClaims).filter(
    (d) => d.status === "completed"
  );
  const availableDonationsFiltered = filteredDonations(
    availableDonations
  ).filter((d) => d.status === "available");

  const renderDonationCard = (donation, isClaimed = false) => (
    <Col key={donation._id}>
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>
            <FaUtensils className="me-2" /> {donation.foodType}
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            Quantity: {donation.quantity}
          </Card.Subtitle>
          <Card.Text>
            <p>
              <FaMapMarkerAlt className="me-2" /> Location:{" "}
              {donation.location || "-"}
            </p>
            <p>
              <FaMapMarkerAlt className="me-2" /> Pickup Address:{" "}
              {donation.pickupAddress}
            </p>
            <p>
              <FaUserAlt className="me-2" /> Donor:{" "}
              {donation.donor?.name || "Unknown"}
            </p>
            <p>
              <FaClock className="me-2" /> Expiry:{" "}
              {donation.expiry
                ? new Date(donation.expiry).toLocaleString()
                : "-"}
            </p>
            <p>
              <FaClock className="me-2" /> Cooked:{" "}
              {donation.cookedTime
                ? new Date(donation.cookedTime).toLocaleString()
                : "-"}
            </p>
            <p>
              <FaClock className="me-2" /> Status: {donation.status}
            </p>
          </Card.Text>
          {donation.status === "available" && (
            <Button variant="primary" onClick={() => handleClaim(donation._id)}>
              Claim Donation
            </Button>
          )}
          {donation.status === "delivered" && isClaimed && (
            <Button
              variant="success"
              onClick={() => handleComplete(donation._id)}
            >
              Mark as Completed
            </Button>
          )}
          {donation.status === "completed" && (
            <p style={{ color: "green", fontWeight: "bold" }}>Completed ✅</p>
          )}
        </Card.Body>
      </Card>
    </Col>
  );

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

        {/* Search / Filter / Sort */}
        <div className="d-flex justify-content-between mb-3 flex-wrap">
          <input
            type="text"
            placeholder="Search by Food / Pickup / Donor"
            className="form-control me-2 mb-2"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ maxWidth: "250px" }}
          />
          <select
            className="form-select me-2 mb-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ maxWidth: "150px" }}
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="claimed">Claimed</option>
            <option value="completed">Completed</option>
            <option value="delivered">Delivered</option>
            select
          </select>
          <select
            className="form-select mb-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ maxWidth: "150px" }}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        {/* Claimed Donations */}
        {statusFilter === "claimed" && (
          <>
            <h3>My Claimed Donations ({claimedDonations.length})</h3>
            {claimedDonations.length === 0 ? (
              <Alert variant="info">
                No claimed donations match your search/filter.
              </Alert>
            ) : (
              <Row xs={1} md={2} lg={3} className="g-4">
                {claimedDonations.map((d) => renderDonationCard(d, true))}
              </Row>
            )}
          </>
        )}

        {/* Completed Donations */}
        {statusFilter === "completed" && (
          <>
            <h3>My Completed Donations ({completedDonations.length})</h3>
            {completedDonations.length === 0 ? (
              <Alert variant="info">
                No completed donations match your search/filter.
              </Alert>
            ) : (
              <Row xs={1} md={2} lg={3} className="g-4">
                {completedDonations.map((d) => renderDonationCard(d, true))}
              </Row>
            )}
          </>
        )}

        {/* Available Donations */}
        {statusFilter === "available" && (
          <>
            <h3>Available Donations ({availableDonationsFiltered.length})</h3>
            {availableDonationsFiltered.length === 0 ? (
              <Alert variant="info">
                No available donations match your search/filter.
              </Alert>
            ) : (
              <Row xs={1} md={2} lg={3} className="g-4">
                {availableDonationsFiltered.map((d) => renderDonationCard(d))}
              </Row>
            )}
          </>
        )}

        {statusFilter === "delivered" && (
          <>
            <h3>My Delivered Donations ({deliveredDonations.length})</h3>
            {deliveredDonations.length === 0 ? (
              <Alert variant="info">
                No delivered donations match your search/filter.
              </Alert>
            ) : (
              <Row xs={1} md={2} lg={3} className="g-4">
                {deliveredDonations.map((d) => renderDonationCard(d, true))}
              </Row>
            )}
          </>
        )}

        {/* If All selected, show all sections */}
        {statusFilter === "all" && (
          <>
            <h3>Available Donations ({availableDonationsFiltered.length})</h3>
            {availableDonationsFiltered.length === 0 ? (
              <Alert variant="info">
                No available donations match your search/filter.
              </Alert>
            ) : (
              <Row xs={1} md={2} lg={3} className="g-4">
                {availableDonationsFiltered.map((d) => renderDonationCard(d))}
              </Row>
            )}

            <h3>My Claimed Donations ({claimedDonations.length})</h3>
            {claimedDonations.length === 0 ? (
              <Alert variant="info">
                No claimed donations match your search/filter.
              </Alert>
            ) : (
              <Row xs={1} md={2} lg={3} className="g-4">
                {claimedDonations.map((d) => renderDonationCard(d, true))}
              </Row>
            )}

            <h3>My Completed Donations ({completedDonations.length})</h3>
            {completedDonations.length === 0 ? (
              <Alert variant="info">
                No completed donations match your search/filter.
              </Alert>
            ) : (
              <Row xs={1} md={2} lg={3} className="g-4">
                {completedDonations.map((d) => renderDonationCard(d, true))}
              </Row>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default ReceiverDashboard;
