import React, { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const BAR_COLORS   = { enCours: "#2563EB", termines: "#22C55E" };
const DONUT_COLORS = ["#2563EB", "#22C55E", "#F59E0B", "#7C3AED", "#EF4444"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border rounded-3 px-3 py-2 shadow-sm" style={{ fontSize: 13 }}>
      <p className="fw-bold text-dark mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.fill, margin: "2px 0" }}>
          {p.name} : <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

const ProgressChart = ({ projects = [] }) => {

  const barData = useMemo(() => {
    const map = {};
    projects.forEach(p => {
      const type = p.type_projet || "Autre";
      if (!map[type]) map[type] = { type, enCours: 0, termines: 0 };
      if (p.status === "En cours")     map[type].enCours++;
      else if (p.status === "Terminé") map[type].termines++;
    });
    return Object.values(map);
  }, [projects]);

  const donutData = useMemo(() => {
    const map = {};
    projects.forEach(p => {
      const type = p.type_projet || "Autre";
      map[type] = (map[type] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [projects]);

  const totalProjets = projects.length;

  const DonutCenterLabel = ({ viewBox }) => {
    if (!viewBox) return null;
    const { cx, cy } = viewBox;
    return (
      <>
        <text x={cx} y={cy - 8} textAnchor="middle" fontSize="11" fill="#9CA3AF" fontWeight="600">
          Total
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="22" fill="#111827" fontWeight="800" fontFamily="monospace">
          {totalProjets}
        </text>
      </>
    );
  };

  return (
    <div className="row g-3 mb-4">

      <div className="col-md-6">
        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
          <div className="card-body p-3">
            <p className="fw-bold mb-3" style={{ fontSize: 14, color: "#111827" }}>Avancement des projets</p>
            {barData.length === 0 ? (
              <div className="text-center text-muted py-5" style={{ fontSize: 13 }}>Aucune donnée disponible</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} barCategoryGap="35%" barGap={4}>
                  <CartesianGrid vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="type" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: 12, color: "#6B7280" }}>{v}</span>} />
                  <Bar dataKey="enCours"  name="En cours" fill={BAR_COLORS.enCours}  radius={[5,5,0,0]} />
                  <Bar dataKey="termines" name="Terminés"  fill={BAR_COLORS.termines} radius={[5,5,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
          <div className="card-body p-3 d-flex flex-column">
            <p className="fw-bold mb-3" style={{ fontSize: 14, color: "#111827" }}>Répartition par type de projet</p>
            {donutData.length === 0 ? (
              <div className="text-center text-muted py-5" style={{ fontSize: 13 }}>Aucune donnée disponible</div>
            ) : (
              <div className="d-flex align-items-center justify-content-center flex-grow-1 gap-4">
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={82}
                      paddingAngle={3}
                      dataKey="value"
                      labelLine={false}
                      label={false}
                    >
                      {donutData.map((_, i) => (
                        <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                    <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" fontSize="11" fill="#9CA3AF" fontWeight="600">
                      Total
                    </text>
                    <text x="50%" y="57%" textAnchor="middle" dominantBaseline="middle" fontSize="22" fill="#111827" fontWeight="800" fontFamily="monospace">
                      {totalProjets}
                    </text>
                  </PieChart>
                </ResponsiveContainer>

                <div className="d-flex flex-column gap-2">
                  {donutData.map((d, i) => (
                    <div key={i} className="d-flex align-items-center gap-2">
                      <div className="rounded-1 flex-shrink-0" style={{ width: 12, height: 12, background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                      <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{d.name}</span>
                      <span className="text-muted ms-auto ps-2" style={{ fontSize: 12 }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;