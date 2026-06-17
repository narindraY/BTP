const db = require("../config/db.nante");

exports.createSuivi = (req, res) => {
  const { avancement, commentaire, projet_id } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : null;

  if (avancement === undefined || !projet_id) {
    return res.status(400).json({ message: "Champs obligatoires manquants ❌" });
  }

  db.query(
    "INSERT INTO SUIVI (avancement, commentaire, photo, projet_id) VALUES (?, ?, ?, ?)",
    [avancement, commentaire, photo, projet_id],
    (err, result) => {
      if (err) {
        console.error("Erreur SQL:", err);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        message: "Suivi ajouté au projet ✅",
        id_suivi: result.insertId
      });
    }
  );
};

exports.getSuivis = (req, res) => {
  db.query(
    `SELECT s.*, p.nom_projet
     FROM SUIVI s
     LEFT JOIN PROJET p ON s.projet_id = p.id_projet
     ORDER BY s.id_suivi DESC`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};
exports.getSuivisByProjet = (req, res) => {
  const { projet_id } = req.params;

  db.query(
    "SELECT * FROM SUIVI WHERE projet_id=? ORDER BY id_suivi DESC",
    [projet_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};
// 🔍 Lire un suivi par ID
exports.getSuiviById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM SUIVI WHERE id_suivi=?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ message: "Suivi introuvable ❌" });
    res.json(rows[0]);
  });
};

exports.updateSuivi = (req, res) => {
  const { id } = req.params;
  const { avancement, commentaire, projet_id } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : req.body.photo;

  db.query(
    "UPDATE SUIVI SET avancement=?, commentaire=?, photo=?, projet_id=? WHERE id_suivi=?",
    [avancement, commentaire, photo, projet_id, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Suivi introuvable ❌" });

      res.json({ message: "Suivi mis à jour ✨" });
    }
  );
};

// ❌ Supprimer un suivi
exports.deleteSuivi = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM SUIVI WHERE id_suivi=?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Suivi introuvable ❌" });
    res.json({ message: "Suivi supprimé 🗑️" });
  });
};