const db = require("../config/db.narindra");

// ➕ Créer un contrat
exports.createContrat = (req, res) => {
  const { user_id, type_contrat, budget, date_debut, date_fin, description } = req.body;

  if (!user_id || !type_contrat || !budget) {
    return res.status(400).json({ message: "Champs obligatoires manquants ❌" });
  }

  db.query(
    "INSERT INTO CONTRAT (user_id, type_contrat, budget, date_debut, date_fin, description) VALUES (?, ?, ?, ?, ?, ?)",
    [user_id, type_contrat, budget, date_debut, date_fin, description],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Contrat créé ✅", id_contrat: result.insertId });
    }
  );
};

// 📄 Lire tous les contrats (avec recherche)
exports.getContrats = (req, res) => {
  const { search } = req.query;

  let sql = `
    SELECT
      c.id_contrat,
      c.user_id,
      u.nom_user AS client,
      c.type_contrat,
      c.budget,
      c.date_debut,
      c.date_fin,
      c.description
    FROM CONTRAT c
    LEFT JOIN USER u ON c.user_id = u.id_user
  `;

  let params = [];

  if (search) {
    sql += ` WHERE u.nom_user LIKE ? OR c.type_contrat LIKE ? OR c.description LIKE ? `;
    params = [`%${search}%`, `%${search}%`, `%${search}%`];
  }

  sql += " ORDER BY c.id_contrat DESC";

  db.query(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// 🔍 Lire un contrat par ID
exports.getContratById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM CONTRAT WHERE id_contrat=?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ message: "Contrat introuvable ❌" });
    res.json(rows[0]);
  });
};

// ✏️ Modifier un contrat
exports.updateContrat = (req, res) => {
  const { id } = req.params;
  const { type_contrat, budget, date_debut, date_fin, description } = req.body;

  db.query(
    "UPDATE CONTRAT SET type_contrat=?, budget=?, date_debut=?, date_fin=?, description=? WHERE id_contrat=?",
    [type_contrat, budget, date_debut, date_fin, description, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Contrat introuvable ❌" });
      res.json({ message: "Contrat mis à jour ✨" });
    }
  );
};

// ❌ Supprimer un contrat
exports.deleteContrat = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM CONTRAT WHERE id_contrat=?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Contrat introuvable ❌" });
    res.json({ message: "Contrat supprimé 🗑️" });
  });
};