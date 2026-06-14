const db = require("../config/db");

// 📊 Récupérer les statistiques globales
exports.getDashboardStats = (req, res) => {
  const stats = {};

  // 1️⃣ Nombre de contrats actifs
  db.query("SELECT COUNT(*) AS totalContrats FROM CONTRAT WHERE date_fin IS NULL OR date_fin >= CURDATE()", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    stats.contratsActifs = rows[0].totalContrats;

    // 2️⃣ Nombre de projets en cours
    db.query("SELECT COUNT(*) AS totalProjets FROM PROJET WHERE status='Actif'", (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      stats.projetsEnCours = rows[0].totalProjets;

      // 3️⃣ Nombre de tâches
      db.query("SELECT COUNT(*) AS totalTaches FROM TACHE", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        stats.totalTaches = rows[0].totalTaches;

        // 4️⃣ Avancement moyen des suivis
        db.query("SELECT AVG(avancement) AS avancementMoyen FROM SUIVI", (err, rows) => {
          if (err) return res.status(500).json({ error: err.message });
          stats.avancementMoyen = rows[0].avancementMoyen || 0;

          // 5️⃣ Répartition des projets par type
          db.query("SELECT type_projet, COUNT(*) AS total FROM PROJET GROUP BY type_projet", (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            stats.projetsParType = rows;

            // 6️⃣ Total budget des contrats
            db.query("SELECT SUM(budget) AS totalBudget FROM CONTRAT", (err, rows) => {
              if (err) return res.status(500).json({ error: err.message });
              stats.totalBudget = rows[0].totalBudget || 0;

              // ✅ Retourner toutes les stats
              res.json(stats);
            });
          });
        });
      });
    });
  });
};
