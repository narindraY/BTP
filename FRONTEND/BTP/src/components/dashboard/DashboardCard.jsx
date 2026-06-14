import React from "react";

export default function DashboardCard({ title, value, color }) {
  return (
    <div
      style={{
        backgroundColor: color,
        padding: "20px",
        borderRadius: "8px",
        color: "#fff",
        textAlign: "center",
        flex: 1,
        margin: "10px"
      }}
    >
      <h3>{title}</h3>
      <p style={{ fontSize: "24px", fontWeight: "bold" }}>{value}</p>
    </div>
  );
}
