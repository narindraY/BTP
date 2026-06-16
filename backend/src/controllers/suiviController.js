const db = require("../config/db.nante");

// ➕ Créer un suivi
exports.createSuivi = (req, res) => {
  const { avancement, commentaire } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : null;
  if (avancement === undefined) {
    return res.status(400).json({ message: "Champs obligatoires manquants ❌" });
  }
  db.query(
    "INSERT INTO SUIVI (avancement, commentaire, photo) VALUES (?, ?, ?)",
    [avancement, commentaire, photo],
    (err, result) => {
      if (err) {
        console.error("Erreur SQL:", err);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: "Suivi ajouté ✅", id_suivi: result.insertId });
    }
  );
};

// 📄 Lire tous les suivis
exports.getSuivis = (req, res) => {
  db.query("SELECT * FROM SUIVI ORDER BY id_suivi DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
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

// ✏️ Modifier un suivi
exports.updateSuivi = (req, res) => {
  const { id } = req.params;
  const { avancement, commentaire } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : req.body.photo;
  db.query(
    "UPDATE SUIVI SET avancement=?, commentaire=?, photo=? WHERE id_suivi=?",
    [avancement, commentaire, photo, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Suivi introuvable ❌" });
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