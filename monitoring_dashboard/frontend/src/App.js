import React, { useEffect, useState } from "react";
import axios from "axios";
import MetricsCard from "./components/MetricsCard";

function App() {
  const [metrics, setMetrics] = useState({});

  const fetchMetrics = async () => {
    try {
      const res = await axios.get("http://localhost:5000/metrics");
      setMetrics(res.data);
    } catch (err) {
      console.error("Error fetching metrics:", err);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h2>Cloud Monitoring Dashboard</h2>
      <MetricsCard metrics={metrics} />
    </div>
  );
}

export default App;
