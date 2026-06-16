const db = require('../config/db.narindra');

exports.getStats = async (req, res) => {
  try {
    const [contrats] = await db.query('SELECT COUNT(*) as total FROM CONTRAT');

    const [projets] = await db.query("SELECT COUNT(*) as total FROM PROJET WHERE status = 'En cours'");

    const [budget] = await db.query('SELECT SUM(budget) as total FROM CONTRAT');

    const [avanc] = await db.query('SELECT AVG(avancement) as moy FROM SUIVI');
    const [repartition] = await db.query('SELECT type_projet, COUNT(*) as total FROM PROJET GROUP BY type_projet');
    const [avancementParType] = await db.query(`
      SELECT 
        p.type_projet,
        AVG(CASE WHEN p.status = 'En cours' THEN s.avancement ELSE NULL END) as moy_en_cours,
        AVG(CASE WHEN p.status = 'Terminé'  THEN s.avancement ELSE NULL END) as moy_termines
      FROM PROJET p
      LEFT JOIN TACHE t  ON t.projet_id  = p.id_projet
      LEFT JOIN SUIVI s  ON s.tache_id   = t.id_tache
      GROUP BY p.type_projet
    `);

    res.status(200).json({
      totalContrats:     contrats[0].total,
      projetsActifs:     projets[0].total,
      budgetTotal:       budget[0].total || 0,
      avancementMoyen:   Math.round(avanc[0].moy || 0),
      repartitionTypes:  repartition,
      avancementParType: avancementParType,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};