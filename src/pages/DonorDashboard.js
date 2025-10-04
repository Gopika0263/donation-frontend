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

  const filteredDonations = (status) =>
    myDonations
      .filter((donation) => {
        const food = donation.foodType?.toLowerCase() || "";
        const org = donation.organization?.toLowerCase() || "";
        const loc = donation.location?.toLowerCase() || "";
        const search = searchText.toLowerCase();

        const statusMatch = status === "all" || donation.status === status;
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

  const renderDonationCard = (donation) => (
    <Col key={donation._id}>
      <Card className="donation-card h-100 shadow-sm">
        {donation.image && (
          <Card.Img
            variant="top"
            src={donation.image}
            style={{ height: "200px", objectFit: "cover", borderRadius: "4px" }}
          />
        )}
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
              <FaPhoneAlt style={{ marginRight: "8px" }} />
              <strong>Phone:</strong> {donation.phone || "-"}
            </p>
            <p>
              <FaClock style={{ marginRight: "8px" }} />
              <strong>Expiry:</strong>{" "}
              {donation.expiry
                ? new Date(donation.expiry).toLocaleString()
                : "-"}
            </p>
            <p>
              <FaClock style={{ marginRight: "8px" }} />
              <strong>Cooked:</strong>{" "}
              {donation.cookedTime
                ? new Date(donation.cookedTime).toLocaleString()
                : "-"}
            </p>
            <p>
              <FaMapMarkerAlt style={{ marginRight: "8px" }} />
              <strong>Location:</strong> {donation.location || "-"}
            </p>
            <p>
              <FaBuilding style={{ marginRight: "8px" }} />
              <strong>Organization:</strong> {donation.organization || "-"}
            </p>
            <p>
              <FaMapMarkerAlt style={{ marginRight: "8px" }} />
              <strong>Pickup Address:</strong> {donation.pickupAddress || "-"}
            </p>
            <p>
              <FaUtensils style={{ marginRight: "8px" }} />
              <strong>Status:</strong> {donation.status}
            </p>
            {donation.receiver && (
              <p>
                <FaBuilding style={{ marginRight: "8px" }} />
                <strong>Claimed by:</strong>{" "}
                {donation.receiver.name || "Unknown"}
              </p>
            )}
            {donation.status === "completed" && (
              <p style={{ color: "green", fontWeight: "bold" }}>Completed ✅</p>
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
  );

  const statuses = [
    "available",
    "claimed",
    "pickedUp",
    "delivered",
    "completed",
  ];

  return (
    <div
      className="donor-dashboard-page"
      style={{
        position: "fixed", // fix to full viewport
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${donationBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflowY: "auto", // allow scrolling inside content
        padding: "20px",
      }}
    >
      <Container
        className="mt-4 bg-light p-4 rounded shadow donor-dashboard-card"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(4px)",
          position: "relative",
          zIndex: 1,
          marginTop: "100px",
         
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
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
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

        {statusFilter === "all"
          ? statuses.map((status) => {
              const donations = filteredDonations(status);
              return (
                <div key={status} className="mb-4">
                  <h3>
                    {status.charAt(0).toUpperCase() + status.slice(1)} Donations
                    ({donations.length})
                  </h3>
                  {donations.length === 0 ? (
                    <Alert variant="info">
                      No {status} donations match your search/filter.
                    </Alert>
                  ) : (
                    <Row xs={1} md={2} lg={3} className="g-4">
                      {donations.map((d) => renderDonationCard(d))}
                    </Row>
                  )}
                </div>
              );
            })
          : (() => {
              const donations = filteredDonations(statusFilter);
              return (
                <div className="mb-4">
                  <h3>
                    {statusFilter.charAt(0).toUpperCase() +
                      statusFilter.slice(1)}{" "}
                    Donations ({donations.length})
                  </h3>
                  {donations.length === 0 ? (
                    <Alert variant="info">
                      No donations match your search/filter.
                    </Alert>
                  ) : (
                    <Row xs={1} md={2} lg={3} className="g-4">
                      {donations.map((d) => renderDonationCard(d))}
                    </Row>
                  )}
                </div>
              );
            })()}
      </Container>
    </div>
  );
};

export default DonorDashboard;
