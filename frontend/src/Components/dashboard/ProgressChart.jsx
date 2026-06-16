import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, ArcElement,
  Tooltip, Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const C_SECONDARY = "#0c7ac4";
const C_HOOVER    = "#46e789";
const C_PRIMARY   = "#060b27";
const PALETTE     = [C_SECONDARY, C_HOOVER, "#f59e0b", "#7c3aed", "#ef4444"];

const TOOLTIP = {
  backgroundColor: "#fff",
  titleColor:      C_PRIMARY,
  bodyColor:       "rgba(6,11,39,0.5)",
  borderColor:     "rgba(6,11,39,0.12)",
  borderWidth:     1,
  padding:         10,
  cornerRadius:    8,
};

const donutCenterPlugin = {
  id: "donutCenter",
  beforeDraw({ config, width, height, ctx }) {
    if (config.type !== "doughnut") return;
    const total = config.data.datasets[0]._total ?? 0;
    const cx = width / 2, cy = height / 2;
    ctx.save();
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = "500 10px sans-serif"; ctx.fillStyle = "rgba(6,11,39,0.38)";
    ctx.fillText("Total", cx, cy - 11);
    ctx.font = "600 20px monospace"; ctx.fillStyle = C_PRIMARY;
    ctx.fillText(total, cx, cy + 10);
    ctx.restore();
  },
};

const useBarData = (projects) =>
  useMemo(() => {
    const map = {};
    projects.forEach(({ type_projet = "Autre", status }) => {
      map[type_projet] ??= { enCours: 0, termines: 0 };
      if (status === "En cours")     map[type_projet].enCours++;
      else if (status === "Terminé") map[type_projet].termines++;
    });
    const entries = Object.entries(map);
    return {
      labels:   entries.map(([k]) => k),
      enCours:  entries.map(([, v]) => v.enCours),
      termines: entries.map(([, v]) => v.termines),
    };
  }, [projects]);

const useDonutData = (projects) =>
  useMemo(() => {
    const map = {};
    projects.forEach(({ type_projet = "Autre" }) => {
      map[type_projet] = (map[type_projet] ?? 0) + 1;
    });
    const entries = Object.entries(map);
    return { labels: entries.map(([k]) => k), values: entries.map(([, v]) => v) };
  }, [projects]);

const barConfig = (labels, enCours, termines) => ({
  data: {
    labels,
    datasets: [
      { label: "En cours",  data: enCours,  backgroundColor: C_SECONDARY, borderRadius: 5, borderSkipped: false, barThickness: 10 },
      { label: "Terminés",  data: termines, backgroundColor: C_HOOVER,    borderRadius: 5, borderSkipped: false, barThickness: 10 },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { ...TOOLTIP, titleFont: { weight: "500", size: 12 }, bodyFont: { size: 12 } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 }, color: "rgba(6,11,39,0.38)" }, border: { display: false } },
      y: { grid: { color: "rgba(6,11,39,0.05)" }, ticks: { font: { size: 11 }, color: "rgba(6,11,39,0.38)", precision: 0 }, border: { display: false } },
    },
  },
});

const donutConfig = (labels, values, total) => ({
  data: {
    labels,
    datasets: [{ data: values, backgroundColor: PALETTE, borderWidth: 0, hoverOffset: 4, _total: total }],
  },
  options: {
    responsive: false,
    cutout: "72%",
    plugins: { legend: { display: false }, tooltip: TOOLTIP },
  },
});

const ChartCard = ({ title, children }) => (
  <div
    className="flex flex-col rounded-xl p-5"
    style={{ background: "var(--bg)", border: "0.5px solid rgba(6,11,39,0.10)", boxShadow: "0 1px 6px rgba(6,11,39,0.06)" }}
  >
    <div className="flex items-center gap-2 mb-4">
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--secondary)" }} />
      <p className="text-[13px] font-semibold m-0" style={{ color: "var(--primary)" }}>{title}</p>
    </div>
    {children}
  </div>
);

const Empty = () => (
  <div className="flex flex-1 items-center justify-center py-10 text-[13px]" style={{ color: "rgba(6,11,39,0.35)" }}>
    Aucune donnée disponible
  </div>
);

const DonutLegend = ({ labels, values }) => (
  <div className="flex flex-col gap-2 flex-1">
    {labels.map((label, i) => (
      <div key={i} className="flex items-center gap-2">
        <span className="shrink-0 rounded-sm" style={{ width: 8, height: 8, background: PALETTE[i % PALETTE.length] }} />
        <span className="flex-1 text-[12px] font-medium" style={{ color: "var(--primary)" }}>{label}</span>
        <span className="text-[11px] font-mono" style={{ color: "rgba(6,11,39,0.45)" }}>{values[i]}</span>
      </div>
    ))}
  </div>
);

const BarLegend = () => (
  <div className="flex gap-4 mb-3">
    {[[C_SECONDARY, "En cours"], [C_HOOVER, "Terminés"]].map(([color, label]) => (
      <div key={label} className="flex items-center gap-1.5 text-[11px]" style={{ color: "rgba(6,11,39,0.4)" }}>
        <span className="rounded-sm" style={{ width: 8, height: 8, background: color, display: "inline-block" }} />
        {label}
      </div>
    ))}
  </div>
);

const ProgressChart = ({ projects = [] }) => {
  const { labels: barLabels, enCours, termines } = useBarData(projects);
  const { labels: donutLabels, values: donutValues } = useDonutData(projects);
  const bar   = barConfig(barLabels, enCours, termines);
  const donut = donutConfig(donutLabels, donutValues, projects.length);

  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 340px" }}>
      <ChartCard title="Avancement des projets">
        {barLabels.length === 0 ? <Empty /> : (
          <>
            <BarLegend />
            <div style={{ height: 200 }}>
              <Bar data={bar.data} options={bar.options} />
            </div>
          </>
        )}
      </ChartCard>

      <ChartCard title="Répartition par type de projet">
        {donutLabels.length === 0 ? <Empty /> : (
          <div className="flex items-center gap-5">
            <Doughnut
              data={donut.data}
              options={donut.options}
              plugins={[donutCenterPlugin]}
              width={140}
              height={140}
            />
            <DonutLegend labels={donutLabels} values={donutValues} />
          </div>
        )}
      </ChartCard>
    </div>
  );
};

export default ProgressChart;