const db = require('../config/db.narindra');

exports.getAllProjects = async (req, res) => {
  try {
    const sql = `
      SELECT 
        p.*,
        c.budget      AS budget_alloue,
        c.date_debut  AS contrat_debut,
        c.date_fin    AS contrat_fin
      FROM PROJET p
      JOIN CONTRAT c ON p.contrat_id = c.id_contrat
      GROUP BY p.id_projet, c.budget, c.date_debut, c.date_fin
    `;
    const [projets] = await db.query(sql);
    res.status(200).json(projets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllContrats = async (req, res) => {
  try {
    const [contrats] = await db.query(`
      SELECT 
        c.id_contrat,
        c.type_contrat,
        c.budget,
        c.date_debut,
        c.date_fin,
        c.description,
        u.nom_user AS client
      FROM CONTRAT c
      JOIN USER u ON c.user_id = u.id_user
      ORDER BY c.id_contrat DESC
    `);
    res.status(200).json(contrats);

  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error",error)
  }
};

exports.createProject = async (req, res) => {
  try {
    const {
      nom_projet,
      type_projet,
      description,
      contrat_id,
      status,
    } = req.body;

    const [contrat] = await db.query('SELECT id_contrat FROM CONTRAT WHERE id_contrat = ?', [contrat_id]);
    if (contrat.length === 0) {
      return res.status(404).json({ message: 'Contrat non trouvé' });
    }

    const [existing] = await db.query('SELECT id_projet FROM PROJET WHERE contrat_id = ?', [contrat_id]);
    if (existing.length > 0) {
      return res.status(400).json({
        message: 'Un projet existe déjà pour ce contrat'
      });
    }

    const sql = `
      INSERT INTO PROJET (nom_projet, type_projet, description, contrat_id, status)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [
      nom_projet,
      type_projet,
      description || null,
      contrat_id,
      status || 'En attente',
    ]);

    res.status(201).json({
      message: 'Projet créé avec succès',
      id_projet: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProjectDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const [projet] = await db.query(`
      SELECT 
        p.*,
        c.budget     AS budget_alloue,
        c.date_debut AS contrat_debut,
        c.date_fin   AS contrat_fin
      FROM PROJET p
      JOIN CONTRAT c ON p.contrat_id = c.id_contrat
      WHERE p.id_projet = ?
    `, [id]);

    if (projet.length === 0) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    res.status(200).json({
      projet:           projet[0],
      avancementGlobal: 0,
      taches:           [],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProjectTasks = async (req, res) => {
  // Pas de table TACHE disponible
  res.status(200).json([]);
};

exports.addSuivi = async (req, res) => {
  // Pas de table TACHE/SUIVI disponible
  res.status(503).json({ message: 'Fonctionnalité non disponible : table TACHE absente' });
};

// ito le projetUser

exports.getMyProjects = async (req, res) => {
  try {
    const userId = req.user.id;
      console.log('req.user:', req.user, '| userId:', userId);
    const sql = `
      SELECT 
        p.*,
        c.budget      AS budget_alloue,
        c.date_debut  AS contrat_debut,
        c.date_fin    AS contrat_fin
      FROM PROJET p
      JOIN CONTRAT c ON p.contrat_id = c.id_contrat
      WHERE c.user_id = ?
      GROUP BY p.id_projet, c.budget, c.date_debut, c.date_fin
    `;

    const [projets] = await db.query(sql, [userId]);
    res.status(200).json(projets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};