import "../../App.css";

export default function SuiviCard({ suivi }) {
  return (
    <div className="rapport-item">
      <span className="rapport-info">
        Tâche {suivi.tache_id} – {suivi.avancement}% – {suivi.commentaire}
      </span>
      {suivi.photo && <img src={suivi.photo} alt="suivi" width="100" />}
    </div>
  );
}