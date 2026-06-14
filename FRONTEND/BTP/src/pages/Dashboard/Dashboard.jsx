import React from "react";
import DashboardStats from "../../components/dashboard/DashboardStats";
import DashboardCharts from "../../components/dashboard/DashboardCharts";

export default function Dashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Tableau de bord</h2>
      <DashboardStats />
      <DashboardCharts />
    </div>
  );
}
