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

function Budget() {
  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");

  



  useEffect(() => {
    const fetchData = async () => {
      try {
        const [budgetRes, spendRes, balanceRes] = await Promise.all([
          axios.get(`${base_url}/finance/budget`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${base_url}/finance/spend`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${base_url}/finance/balance`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

         console.log("budget raw:", budgetRes.data);
    console.log("spend raw:", spendRes.data);
    console.log("balance raw:", balanceRes.data);
setData({
  budget: budgetRes.data.length > 0 ? Number(budgetRes.data[0].budget) : 0,
  spend: spendRes.data.length > 0 ? Number(spendRes.data[0].spending) : 0,
  balance: balanceRes.data.length > 0 ? Number(balanceRes.data[0].reste_budget) : 0,
});
      } catch (error) {
        console.log("error loading finance data", error);
      }
    };
    fetchData();
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen text-white bg-slate-900">
        Loading...
      </div>
    );
  }

  const chartData = {
    labels: ["Finance"],
    datasets: [
      {
        label: "Budget",
        data: [data.budget],
        backgroundColor: "#22c55e",
      },
      {
        label: "Dépenses",
        data: [data.spend],
        backgroundColor: "#ef4444",
      },
      {
        label: "Balance",
        data: [data.balance],
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "#cbd5e1" },
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#fff",
        bodyColor: "#cbd5e1",
      },
    },
    scales: {
      x: { ticks: { color: "#cbd5e1" }, grid: { color: "#334155" } },
      y: { ticks: { color: "#cbd5e1" }, grid: { color: "#334155" } },
    },
  };

  return (
    <div className="min-h-screen text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Finance</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800 p-4 rounded-xl shadow-lg hover:scale-105 transition duration-300">
          <div className="flex items-center gap-3">
            <FaWallet className="text-green-400 text-xl" />
            <h2 className="text-lg font-semibold">Budget</h2>
          </div>
          <p className="text-2xl mt-2 text-green-300">{data.budget}</p>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl shadow-lg hover:scale-105 transition duration-300">
          <div className="flex items-center gap-3">
            <FaChartLine className="text-red-400 text-xl" />
            <h2 className="text-lg font-semibold">Dépenses</h2>
          </div>
          <p className="text-2xl mt-2 text-red-300">{data.spend}</p>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl shadow-lg hover:scale-105 transition duration-300">
          <div className="flex items-center gap-3">
            <FaMoneyBillWave className="text-blue-400 text-xl" />
            <h2 className="text-lg font-semibold">Balance</h2>
          </div>
          <p className="text-2xl mt-2 text-blue-300">{data.balance}</p>
        </div>
      </div>

      <div className="bg-slate-800 p-2 rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Évolution financière</h2>
        <div style={{ height: "230px" }}>
  <Bar data={chartData} options={{ ...chartOptions, maintainAspectRatio: false }} />
</div>
      </div>
    </div>
  );
}

export default Budget;