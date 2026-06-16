const db = require('../config/db.narindra');

exports.getAllProjects = async (req, res) => {
  try {
    const sql = `
      SELECT 
        p.*,
        c.budget      AS budget_alloue,
        c.date_debut  AS contrat_debut,
        c.date_fin    AS contrat_fin,
        AVG(s.avancement) AS avancement_moyen
      FROM PROJET p
      JOIN CONTRAT c ON p.contrat_id = c.id_contrat
      LEFT JOIN TACHE t ON t.projet_id = p.id_projet
      LEFT JOIN SUIVI s ON s.tache_id  = t.id_tache
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
        u.nom_user AS client
      FROM CONTRAT c
      JOIN USER u ON c.user_id = u.id_user
      ORDER BY c.id_contrat DESC
    `);
    res.status(200).json(contrats);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    const [contrat] = await db.query('SELECT id_contrat FROM CONTRAT WHERE id_contrat = ?',[contrat_id]);
    if (contrat.length === 0) {
      return res.status(404).json({ message: 'Contrat non trouvé' });
    }

    const [existing] = await db.query('SELECT id_projet FROM PROJET WHERE contrat_id = ?',[contrat_id]);
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

    const [avgResult] = await db.query(`
      SELECT ROUND(AVG(s.avancement), 0) AS avancement_global
      FROM SUIVI s
      JOIN TACHE t ON s.tache_id = t.id_tache
      WHERE t.projet_id = ?
    `, [id]);

    const [taches] = await db.query(`
      SELECT 
        t.id_tache,
        t.nom_tache,
        t.statut,
        t.date_debut,
        t.date_fin,
        s.avancement,
        s.commentaire,
        s.photo       AS photo_url,
        s.created_at  AS date_suivi,
        u.nom_user    AS responsable
      FROM TACHE t
      LEFT JOIN SUIVI s ON s.tache_id = t.id_tache
        AND s.id_suivi = (
          SELECT MAX(s2.id_suivi) 
          FROM SUIVI s2 
          WHERE s2.tache_id = t.id_tache
        )
      LEFT JOIN CHAT ch ON ch.projet_ID = t.projet_id
        AND ch.created_at = (
          SELECT MAX(ch2.created_at)
          FROM CHAT ch2
          WHERE ch2.projet_ID = t.projet_id
        )
      LEFT JOIN USER u ON ch.user_ID = u.id_user
      WHERE t.projet_id = ?
      ORDER BY t.date_debut DESC
    `, [id]);

    res.status(200).json({
      projet:           projet[0],
      avancementGlobal: avgResult[0].avancement_global || 0,
      taches,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProjectTasks = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      SELECT 
        t.*,
        s.avancement,
        s.commentaire,
        s.photo AS photo_url,
        s.created_at AS date_suivi
      FROM TACHE t
      LEFT JOIN SUIVI s ON t.id_tache = s.tache_id
      WHERE t.projet_id = ?
      ORDER BY t.date_debut DESC
    `;
    const [tasks] = await db.query(sql, [id]);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addSuivi = async (req, res) => {
  try {
    const { tache_id, avancement, commentaire, photo } = req.body;
    const { id } = req.params;

    const [check] = await db.query(
      'SELECT id_tache FROM TACHE WHERE id_tache = ? AND projet_id = ?',
      [tache_id, id]
    );
    if (check.length === 0) {
      return res.status(404).json({ message: 'Tâche non trouvée dans ce projet' });
    }

    await db.query(`
      INSERT INTO SUIVI (tache_id, avancement, commentaire, photo)
      VALUES (?, ?, ?, ?)
    `, [tache_id, avancement, commentaire, photo || null]);

    let nouveauStatut = 'En cours';
    if (avancement >= 100) nouveauStatut = 'Terminé';
    if (avancement === 0)  nouveauStatut = 'Non démarré';

    await db.query(
      'UPDATE TACHE SET statut = ? WHERE id_tache = ?',
      [nouveauStatut, tache_id]
    );

    res.status(201).json({ message: 'Mise à jour ajoutée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ito le projetUser

exports.getMyProjects = async (req, res) => {
  try {
    const userId = req.user.id_user;

    const sql = `
      SELECT 
        p.*,
        c.budget      AS budget_alloue,
        c.date_debut  AS contrat_debut,
        c.date_fin    AS contrat_fin,
        AVG(s.avancement) AS avancement_moyen
      FROM PROJET p
      JOIN CONTRAT c ON p.contrat_id = c.id_contrat
      LEFT JOIN TACHE t ON t.projet_id = p.id_projet
      LEFT JOIN SUIVI s ON s.tache_id = t.id_tache
      WHERE c.user_id = ?
      GROUP BY p.id_projet, c.budget, c.date_debut, c.date_fin
    `;

    const [projets] = await db.query(sql, [userId]);
    res.status(200).json(projets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};