import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import api from "../../services/api";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardCharts() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/dashboard").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p>Chargement...</p>;

  const barData = {
    labels: stats.projetsParType.map((p) => p.type_projet),
    datasets: [
      {
        label: "Nombre de projets",
        data: stats.projetsParType.map((p) => p.total),
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"]
      }
    ]
  };

  const pieData = {
    labels: stats.projetsParType.map((p) => p.type_projet),
    datasets: [
      {
        data: stats.projetsParType.map((p) => p.total),
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"]
      }
    ]
  };

  return (
    <div style={{ display: "flex", gap: "40px", marginTop: "20px" }}>
      <div style={{ width: "50%" }}>
        <h3>Projets par type</h3>
        <Pie key="pieChart" data={pieData} />
      </div>
      <div style={{ width: "50%" }}>
        <h3>Nombre de projets</h3>
        <Bar key="barChart" data={barData} />
      </div>
    </div>
  );
}
