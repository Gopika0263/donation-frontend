import React, { useEffect, useState } from "react";
import { Container, Table, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

const AdminDashboard = () => {
  const { authAxios } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchDonations = async () => {
    setError("");
    try {
      const res = await authAxios.get("/admin/donations");
      setDonations(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to fetch donations.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setError("");
    setSuccess("");
    try {
      await authAxios.put(`/admin/donations/${id}`, { status });
      setSuccess(`Donation marked as ${status}!`);
      fetchDonations();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to update donation.");
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <Container className="mt-4">
      <h2>Admin Dashboard</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {donations.length === 0 ? (
        <Alert variant="info">No donations found.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Food Type</th>
              <th>Quantity</th>
              <th>Pickup Address</th>
              <th>Status</th>
              <th>Donor</th>
              <th>Receiver</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d) => (
              <tr key={d._id}>
                <td>{d.foodType}</td>
                <td>{d.quantity}</td>
                <td>{d.pickupAddress}</td>
                <td>
                  <strong>{d.status}</strong>
                </td>
                <td>{d.donor?.name || "Unknown"}</td>
                <td>{d.receiver?.name || "-"}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => updateStatus(d._id, "delivered")}
                  >
                    Mark Delivered
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => updateStatus(d._id, "completed")}
                  >
                    Mark Completed
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminDashboard;
