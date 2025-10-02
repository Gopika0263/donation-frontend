import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Form, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { Bar } from "react-chartjs-2";
import { FaUtensils, FaUsers, FaUserCheck } from "react-icons/fa";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminDashboard = () => {
  const { authAxios } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedCard, setExpandedCard] = useState(""); // "donations", "donors", "receivers"
  const [searchText, setSearchText] = useState("");
  const [timeRange, setTimeRange] = useState(7); // 7, 30, 90

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

  useEffect(() => {
    fetchDonations();
  }, []);

  if (loading) return <LoadingSpinner />;

  // Counts
  const totalDonations = donations.length;
  const donorsList = [
    ...new Set(donations.map((d) => d.donor?.name).filter(Boolean)),
  ];
  const totalDonors = donorsList.length;
  const receiversList = [
    ...new Set(
      donations
        .filter((d) => d.receiver)
        .map((d) => d.receiver?.name)
        .filter(Boolean)
    ),
  ];
  const totalReceivers = receiversList.length;

  // Generate labels based on selected time range
  const getLabels = (days) => {
    return Array.from({ length: days }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    });
  };

  const labels = getLabels(timeRange);

  const getCountByDate = (type) => {
    const map = {};
    labels.forEach((day) => (map[day] = 0));
    donations.forEach((d) => {
      const date = new Date(d.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (map[date] !== undefined) {
        if (type === "donations") map[date] += 1;
        if (type === "donors" && d.donor?.name) map[date] += 1;
        if (type === "receivers" && d.receiver?.name) map[date] += 1;
      }
    });
    return Object.values(map);
  };

  const miniChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: "white" } },
      y: { display: false },
    },
  };

  const summaryChartData = {
    labels,
    datasets: [
      {
        label: "Donations",
        data: getCountByDate("donations"),
        backgroundColor: "rgba(13, 137, 219, 0.6)",
      },
      {
        label: "Donors",
        data: getCountByDate("donors"),
        backgroundColor: "rgba(232, 172, 21, 0.6)",
      },
      {
        label: "Receivers",
        data: getCountByDate("receivers"),
        backgroundColor: "rgba(9, 247, 247, 0.6)",
      },
    ],
  };

  const getCardColor = (type, value) => {
    if (type === "donations") return value > 0 ? "primary" : "secondary";
    if (type === "donors") return value > 0 ? "info" : "secondary";
    if (type === "receivers") return value > 0 ? "success" : "secondary";
    return "secondary";
  };

  const handleCardClick = (type) => {
    setExpandedCard(expandedCard === type ? "" : type);
    setSearchText("");
  };

  const renderCard = (icon, title, value, type) => (
    <Col md={4}>
      <Card
        className={`text-center p-3 shadow-sm bg-${getCardColor(
          type,
          value
        )} text-white`}
        style={{ cursor: "pointer" }}
        onClick={() => handleCardClick(type)}
      >
        <div style={{ fontSize: "30px", marginBottom: "5px" }}>{icon}</div>
        <h6>{title}</h6>
        <h4>{value}</h4>
        <div style={{ height: "50px" }}>
          <Bar
            data={{
              labels,
              datasets: [
                {
                  data: getCountByDate(type),
                  backgroundColor: "rgba(255,255,255,0.8)",
                  barThickness: 6,
                },
              ],
            }}
            options={miniChartOptions}
          />
        </div>
      </Card>
    </Col>
  );

  let tableData = [];
  if (expandedCard === "donations") tableData = donations;
  if (expandedCard === "donors") tableData = donations.filter((d) => d.donor);
  if (expandedCard === "receivers")
    tableData = donations.filter((d) => d.receiver);

  const filteredTableData = tableData.filter((item) => {
    if (!searchText) return true;
    return (
      item.foodType?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.donor?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.receiver?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.pickupAddress?.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const expandedChartData = {
    labels,
    datasets: [
      {
        label: expandedCard,
        data: getCountByDate(expandedCard),
        backgroundColor:
          expandedCard === "donations"
            ? "rgba(54, 162, 235, 0.6)"
            : expandedCard === "donors"
            ? "rgba(255, 206, 86, 0.6)"
            : "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Admin Dashboard</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="g-4">
        {renderCard(
          <FaUtensils />,
          "Total Donations",
          totalDonations,
          "donations"
        )}
        {renderCard(<FaUsers />, "Total Donors", totalDonors, "donors")}
        {renderCard(
          <FaUserCheck />,
          "Total Receivers",
          totalReceivers,
          "receivers"
        )}
      </Row>

      {expandedCard && (
        <Card className="mt-4 p-3 shadow-sm">
          <Form.Control
            type="text"
            placeholder={`Search ${expandedCard}...`}
            className="mb-3"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Food Type</th>
                <th>Quantity</th>
                <th>Donor</th>
                <th>Receiver</th>
                <th>Pickup Address</th>
                <th>Location</th>
                <th>Phone</th>
                <th>Cooked Time</th>
                <th>Expiry Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTableData.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center">
                    No records found.
                  </td>
                </tr>
              ) : (
                filteredTableData.map((d, idx) => (
                  <tr key={idx}>
                    <td>{d.foodType}</td>
                    <td>{d.quantity}</td>
                    <td>{d.donor?.name || "-"}</td>
                    <td>{d.receiver?.name || "-"}</td>
                    <td>{d.pickupAddress || "-"}</td>
                    <td>{d.location || "-"}</td>
                    <td>{d.phone || "-"}</td>
                    <td>
                      {d.cookedTime
                        ? new Date(d.cookedTime).toLocaleString()
                        : "-"}
                    </td>
                    <td>
                      {d.expiry ? new Date(d.expiry).toLocaleString() : "-"}
                    </td>
                    <td>{d.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {/* Time range filter for expanded chart */}
          <Form.Select
            className="mb-3"
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
          </Form.Select>

          <h5 className="mt-3 text-center">
            Last {timeRange} Days {expandedCard} Trend
          </h5>
          <div style={{ height: "200px" }}>
            <Bar
              data={expandedChartData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </Card>
      )}

      {!expandedCard && (
        <Card className="mt-4 p-3 shadow-sm">
          <Form.Select
            className="mb-3"
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
          </Form.Select>

          <h5 className="mb-3 text-center">Last {timeRange} Days Summary</h5>
          <div style={{ height: "250px" }}>
            <Bar
              data={summaryChartData}
              options={{
                responsive: true,
                plugins: { legend: { position: "top" } },
              }}
            />
          </div>
        </Card>
      )}
    </Container>
  );
};

export default AdminDashboard;
