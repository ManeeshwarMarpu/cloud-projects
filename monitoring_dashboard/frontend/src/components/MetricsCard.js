import React from "react";

function MetricsCard({ metrics }) {
  const { cpu_percent, memory_percent, uptime } = metrics;

  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "10px",
      padding: "20px",
      display: "inline-block",
      minWidth: "250px"
    }}>
      <h3>System Metrics</h3>
      <p>CPU Usage: {cpu_percent ? cpu_percent + "%" : "Loading..."}</p>
      <p>Memory Usage: {memory_percent ? memory_percent + "%" : "Loading..."}</p>
      <p>Uptime: {uptime ? uptime + "s" : "Loading..."}</p>
    </div>
  );
}

export default MetricsCard;
