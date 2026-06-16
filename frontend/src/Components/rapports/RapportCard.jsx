
export default function RapportCard({ type, date }) {
  return (
    <li className="rapport-item">
      <span className="rapport-info">
        {type} – {date}
      </span>
      <button className="btn-primary">⬇ Télécharger</button>
    </li>
  );
}