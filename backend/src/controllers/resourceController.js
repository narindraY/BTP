const { pool: db } = require('../config/db');

exports.getAllResources = async (req, res) => {
  try {
    const { type, projet_id } = req.query;

    let sql = 'SELECT * FROM RESSOURCE';
    const params = [];
    const conditions = [];

    if (type) {
      conditions.push('type_ressource = ?');
      params.push(type);
    }
    if (projet_id) {
      conditions.push('projet_id = ?');
      params.push(projet_id);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    const [rows] = await db.query(sql, params);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des ressources' });
  }
};

exports.addResource = async (req, res) => {
  try {
    const { nom_ressource, quantite, type_ressource, prix_unitaire, unite, projet_id } = req.body;

    await db.query(`
      INSERT INTO RESSOURCE (nom_ressource, quantite, type_ressource, prix_unitaire, unite, projet_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [nom_ressource, quantite, type_ressource, prix_unitaire, unite, projet_id || null]);

    res.status(201).json({ message: 'Ressource ajoutée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom_ressource, quantite, type_ressource, prix_unitaire, unite, projet_id } = req.body;

    const [result] = await db.query(`
      UPDATE RESSOURCE
      SET nom_ressource  = ?,
          quantite       = ?,
          type_ressource = ?,
          prix_unitaire  = ?,
          unite          = ?,
          projet_id      = ?
      WHERE id_ressource = ?
    `, [nom_ressource, quantite, type_ressource, prix_unitaire, unite, projet_id || null, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ressource non trouvée' });
    }
    res.status(200).json({ message: 'Ressource mise à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    const [used] = await db.query(
      'SELECT tache_id FROM TACHE_RESSOURCE WHERE ressource_id = ? LIMIT 1',
      [id]
    );
    if (used.length > 0) {
      return res.status(400).json({
        message: 'Impossible de supprimer : ressource utilisée dans une tâche'
      });
    }

    const [result] = await db.query(
      'DELETE FROM RESSOURCE WHERE id_ressource = ?', [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ressource non trouvée' });
    }
    res.status(200).json({ message: 'Ressource supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
