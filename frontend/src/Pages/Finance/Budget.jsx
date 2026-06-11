import axios from "axios";
import { useEffect, useState } from "react";
import { base_url } from "../../Utils/IP";

import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Line,
} from "recharts";

import { FaWallet, FaChartLine, FaMoneyBillWave } from "react-icons/fa";

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

        setData({
          budget: Number(budgetRes.data),
          spend: Number(spendRes.data),
          balance: Number(balanceRes.data),
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

  const chartData = [
    {
      name: "Finance",
      open: data.budget,
      high: data.budget,
      low: data.spend,
      close: data.balance,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      {/* TITLE */}
      <h1 className="text-2xl font-bold mb-6 animate-fadeIn">
        💰 Dashboard Finance
      </h1>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        {/* Budget */}
        <div className="bg-slate-800 p-5 rounded-xl shadow-lg
                        hover:scale-105 transition duration-300">
          <div className="flex items-center gap-3">
            <FaWallet className="text-green-400 text-xl" />
            <h2 className="text-lg font-semibold">Budget</h2>
          </div>
          <p className="text-2xl mt-2 text-green-300">
            {data.budget}
          </p>
        </div>

        {/* Spend */}
        <div className="bg-slate-800 p-5 rounded-xl shadow-lg
                        hover:scale-105 transition duration-300">
          <div className="flex items-center gap-3">
            <FaChartLine className="text-red-400 text-xl" />
            <h2 className="text-lg font-semibold">Dépenses</h2>
          </div>
          <p className="text-2xl mt-2 text-red-300">
            {data.spend}
          </p>
        </div>

        {/* Balance */}
        <div className="bg-slate-800 p-5 rounded-xl shadow-lg
                        hover:scale-105 transition duration-300">
          <div className="flex items-center gap-3">
            <FaMoneyBillWave className="text-blue-400 text-xl" />
            <h2 className="text-lg font-semibold">Balance</h2>
          </div>
          <p className="text-2xl mt-2 text-blue-300">
            {data.balance}
          </p>
        </div>
      </div>

      {/* CHART */}
      <div className="bg-slate-800 p-5 rounded-xl shadow-lg
                      hover:shadow-2xl transition duration-300">

        <h2 className="text-lg font-semibold mb-4">
          📈 Evolution financière
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={chartData}>
            <XAxis dataKey="name" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip />

            <Bar dataKey="high" fill="#22c55e" />
            <Bar dataKey="low" fill="#ef4444" />
            <Line type="monotone" dataKey="open" stroke="#60a5fa" />
            <Line type="monotone" dataKey="close" stroke="#facc15" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Budget;