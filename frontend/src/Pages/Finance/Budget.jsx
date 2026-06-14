import axios from "axios";
import { useEffect, useState } from "react";
import { base_url } from "../../Utils/IP";
import { FaWallet, FaChartLine, FaMoneyBillWave } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Petit composant réutilisable pour les cartes de statistiques
const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-slate-800 p-4 rounded-xl shadow-lg hover:scale-105 transition duration-300">
    <div className="flex items-center gap-3">
      <Icon className={`${colorClass} text-xl`} />
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
    <p className={`text-2xl mt-2 ${colorClass.replace('text-', 'text-opacity-80 text-')}`}>{value}</p>
  </div>
);

function Budget() {
  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [budgetRes, spendRes, balanceRes] = await Promise.all([
          axios.get(`${base_url}/finance/budget`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${base_url}/finance/spend`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${base_url}/finance/balance`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setData({
          budget: budgetRes.data.length > 0 ? Number(budgetRes.data[0].budget) : 0,
          spend: spendRes.data.length > 0 ? Number(spendRes.data[0].spending) : 0,
          balance: balanceRes.data.length > 0 ? Number(balanceRes.data[0].reste_budget) : 0,
        });
      } catch (error) {
        console.log("Erreur lors du chargement des données financières", error);
      }
    };
    if (token) fetchData();
  }, [token]);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <span className="ml-3">Chargement...</span>
      </div>
    );
  }

  const chartData = {
    labels: ["Récapitulatif"],
    datasets: [
      { label: "Budget", data: [data.budget], backgroundColor: "#22c55e" },
      { label: "Dépenses", data: [data.spend], backgroundColor: "#ef4444" },
      { label: "Balance", data: [data.balance], backgroundColor: "#3b82f6" },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#cbd5e1" } },
      tooltip: { backgroundColor: "#1e293b", titleColor: "#fff", bodyColor: "#cbd5e1" },
    },
    scales: {
      x: { ticks: { color: "#cbd5e1" }, grid: { color: "#334155" } },
      y: { ticks: { color: "#cbd5e1" }, grid: { color: "#334155" } },
    },
  };

  return (
    <div className="text-white p-4">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord financier</h1>
      
      {/* Grille des cartes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard title="Budget" value={data.budget} icon={FaWallet} colorClass="text-green-400" />
        <StatCard title="Dépenses" value={data.spend} icon={FaChartLine} colorClass="text-red-400" />
        <StatCard title="Balance" value={data.balance} icon={FaMoneyBillWave} colorClass="text-blue-400" />
      </div>

      {/* Graphique */}
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-slate-300">Évolution financière</h2>
        <div className="h-64">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default Budget;