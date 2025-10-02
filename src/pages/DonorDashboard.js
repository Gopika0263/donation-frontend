import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { useLocation } from "react-router-dom";
import donationBg from "../assets/donation_dash.jpeg";
import "./DonorDashboard.css";

import {
  FaUtensils,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaBuilding,
  FaClock,
  FaUser,
} from "react-icons/fa";

const DonorDashboard = () => {
  const { authAxios } = useAuth();
  const location = useLocation();

  const [myDonations, setMyDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

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
    if (location.state?.newDonation) {
      setMyDonations((prev) => [location.state.newDonation, ...prev]);
    }
  }, [location.state]);

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

  const filteredDonations = myDonations
    .filter((donation) => {
      const food = donation.foodType?.toLowerCase() || "";
      const org = donation.organization?.toLowerCase() || "";
      const loc = donation.location?.toLowerCase() || "";
      const search = searchText.toLowerCase();

      const statusMatch =
        statusFilter === "all" || donation.status === statusFilter;
      const searchMatch =
        food.includes(search) || org.includes(search) || loc.includes(search);

      return statusMatch && searchMatch;
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "expiry") return new Date(a.expiry) - new Date(b.expiry);
      return 0;
    });

  return (
    <div
      className="donor-dashboard-page"
      style={{
        backgroundImage: `url(${donationBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Container
        className="mt-4 bg-light p-4 rounded shadow donor-dashboard-card"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(4px)",
        }}
      >
        <h2 className="mb-4 text-center">Donor Dashboard</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <div className="d-flex justify-content-between mb-3 flex-wrap">
          <input
            type="text"
            placeholder="Search by Food / Org / Location"
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
            <option value="pickedUp">Picked Up</option>
            <option value="delivered">Delivered</option>
            <option value="completed">Completed</option>
          </select>

          <select
            className="form-select mb-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ maxWidth: "150px" }}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="expiry">Expiry Date</option>
          </select>
        </div>

        {filteredDonations.length === 0 ? (
          <Alert variant="info">No donations match your search/filter.</Alert>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {filteredDonations.map((donation) => (
              <Col key={donation._id}>
                <Card className="donation-card h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title>
                      <FaUtensils style={{ marginRight: "8px" }} />
                      {donation.foodType}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Quantity: {donation.quantity}
                    </Card.Subtitle>

                    <Card.Text>
                      <p>
                        <FaPhoneAlt
                          style={{
                            marginRight: "8px",
                            color: "black",
                            fontSize: "18px",
                          }}
                        />
                        <strong>Phone Number:</strong> {donation.phone || "-"}
                      </p>
                      <p>
                        <FaClock
                          style={{
                            marginRight: "8px",
                            color: "black",
                            fontSize: "18px",
                          }}
                        />
                        <strong>Expiry Date & Time:</strong>{" "}
                        {donation.expiry
                          ? new Date(donation.expiry).toLocaleString()
                          : "-"}
                      </p>
                      <p>
                        <FaClock
                          style={{
                            marginRight: "8px",
                            color: "black",
                            fontSize: "18px",
                          }}
                        />
                        <strong>Cooked Date & Time:</strong>{" "}
                        {donation.cookedTime
                          ? new Date(donation.cookedTime).toLocaleString()
                          : "-"}
                      </p>
                      <p>
                        <FaMapMarkerAlt
                          style={{
                            marginRight: "8px",
                            color: "black",
                            fontSize: "18px",
                          }}
                        />
                        <strong>Location:</strong> {donation.location || "-"}
                      </p>
                      <p>
                        <FaBuilding
                          style={{
                            marginRight: "8px",
                            color: "black",
                            fontSize: "18px",
                          }}
                        />
                        <strong>Organization:</strong>{" "}
                        {donation.organization || "-"}
                      </p>
                      <p>
                        <FaMapMarkerAlt
                          style={{
                            marginRight: "8px",
                            color: "black",
                            fontSize: "18px",
                          }}
                        />
                        <strong>Pickup Address:</strong>{" "}
                        {donation.pickupAddress || "-"}
                      </p>
                      <p>
                        <FaUtensils
                          style={{
                            marginRight: "8px",
                            color: "black",
                            fontSize: "18px",
                          }}
                        />
                        <strong>Status:</strong> {donation.status}
                      </p>
                      {donation.receiver && (
                        <p>
                          <FaBuilding
                            style={{
                              marginRight: "8px",
                              color: "black",
                              fontSize: "18px",
                            }}
                          />
                          <strong>Claimed by:</strong>{" "}
                          {donation.receiver.name || "Unknown"}
                        </p>
                      )}

                      {donation.status === "completed" && (
                        <p style={{ color: "green", fontWeight: "bold" }}>
                          Completed ✅
                        </p>
                      )}
                    </Card.Text>

                    {donation.status === "claimed" && (
                      <Button
                        variant="warning"
                        onClick={() => handlePickup(donation._id)}
                        className="mb-2 w-100"
                      >
                        Mark as Picked Up
                      </Button>
                    )}

                    {donation.status === "pickedUp" && (
                      <Button
                        variant="success"
                        onClick={() => handleDeliver(donation._id)}
                        className="mb-2 w-100"
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
