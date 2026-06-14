import React, { useEffect, useState } from "react";
import api from "../../services/api";
import DashboardCard from "./DashboardCard";

export default function DashboardStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/dashboard").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p>Chargement...</p>;

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <DashboardCard title="Contrats actifs" value={stats.contratsActifs} color="green" />
      <DashboardCard title="Projets en cours" value={stats.projetsEnCours} color="blue" />
      <DashboardCard title="Total tâches" value={stats.totalTaches} color="orange" />
      <DashboardCard title="Avancement moyen" value={`${stats.avancementMoyen}%`} color="purple" />
      <DashboardCard title="Budget total" value={`${stats.totalBudget} Ar`} color="red" />
    </div>
  );
}
