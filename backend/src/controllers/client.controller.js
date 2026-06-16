const { pool: db } = require('../config/db');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Récupérer les projets du client connecté via demande -> contrat -> projet
exports.createDemande = async (req, res) => {
  try {
    const userId = req.user.id;
    const { titre, description, type_realisation, budget_client, date_souhaitee } = req.body;

    if (!titre) return res.status(400).json({ error: 'Le titre est requis' });

    // 1. Insérer la demande
    const [result] = await db.query(
      `INSERT INTO demande (client_id, titre, description, type_realisation, budget_client, date_souhaitee)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, titre, description, type_realisation, budget_client || null, date_souhaitee || null]
    );
    const demandeId = result.insertId;

    // 2. Générer le PDF
    const pdfDir = path.join(__dirname, '../../uploads/demandes');
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

    const pdfFileName = `demande_${demandeId}_${Date.now()}.pdf`;
    const pdfPath = path.join(pdfDir, pdfFileName);

    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    // En-tête
    doc.fontSize(22).font('Helvetica-Bold').text('DEMANDE DE DEVIS', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').fillColor('#666')
      .text(`Réf: DEM-${demandeId}`, { align: 'center' });
    doc.moveDown(0.5);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, { align: 'center' });
    doc.moveDown(1.5);

    // Ligne de séparation
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#ccc').stroke();
    doc.moveDown(1);

    // Contenu
    doc.fontSize(11).fillColor('#000');
    const fields = [
      ['TITRE', titre],
      ['TYPE DE RÉALISATION', type_realisation || 'Non spécifié'],
      ['BUDGET', budget_client ? `${Number(budget_client).toLocaleString('fr-FR')} Ar` : 'Non spécifié'],
      ['DATE SOUHAITÉE', date_souhaitee ? new Date(date_souhaitee).toLocaleDateString('fr-FR') : 'Non spécifiée'],
    ];

    fields.forEach(([label, value]) => {
      doc.font('Helvetica-Bold').text(`${label}:`);
      doc.font('Helvetica').text(`  ${value}`);
      doc.moveDown(0.5);
    });

    if (description) {
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('DESCRIPTION:');
      doc.font('Helvetica').text(`  ${description}`, { align: 'justify' });
    }

    doc.end();
    await new Promise(resolve => stream.on('finish', resolve));

    // 3. Discussion existante ?
    const [discussions] = await db.query(
      'SELECT id_discussion FROM discussion WHERE client_id = ?',
      [userId]
    );
    let discussionId;
    if (discussions.length > 0) {
      discussionId = discussions[0].id_discussion;
    } else {
      const [newDisc] = await db.query(
        'INSERT INTO discussion (client_id, statut) VALUES (?, "ouverte")',
        [userId]
      );
      discussionId = newDisc.insertId;
    }

    // 4. Message dans le chat avec le PDF au format attendu
    const pdfUrl = `/uploads/demandes/${pdfFileName}`;
    const messageContent = `demande_${demandeId}.pdf|||${pdfUrl}|||application/pdf|||file`;
    const [message] = await db.query(
      'INSERT INTO message (discussion_id, utilisateur_id, contenu) VALUES (?, ?, ?)',
      [discussionId, userId, messageContent]
    );

    res.status(201).json({
      message: 'Demande créée avec succès',
      demande_id: demandeId,
      pdf_url: pdfUrl,
      discussion_id: discussionId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getClientProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    // Récupérer les demandes du client
    const [demandes] = await db.query(
      `SELECT id_demande, titre, description, type_realisation, budget_client,
              date_souhaitee, statut AS statut_demande
       FROM demande WHERE client_id = ? ORDER BY id_demande DESC`,
      [userId]
    );

    if (demandes.length === 0) {
      return res.json({ projets: [] });
    }

    const demandeIds = demandes.map(d => d.id_demande);

    // Récupérer les contrats liés aux demandes
    const [contrats] = await db.query(
      `SELECT id_contrat, demande_id, reference, budget, description AS desc_contrat,
              date_signature, date_debut, date_fin, statut AS statut_contrat
       FROM contrat WHERE demande_id IN (?)`,
      [demandeIds]
    );

    if (contrats.length === 0) {
      return res.json({
        demandes,
        projets: []
      });
    }

    const contratIds = contrats.map(c => c.id_contrat);

    // Récupérer les projets avec avancement global
    const [projets] = await db.query(
      `SELECT p.*,
              ROUND(AVG(s.pourcentage), 0) AS avancement_global,
              COUNT(DISTINCT t.id_tache) AS total_taches,
              COUNT(DISTINCT CASE WHEN t.statut = 'termine' THEN t.id_tache END) AS taches_terminees
       FROM projet p
       LEFT JOIN tache t ON t.projet_id = p.id_projet
       LEFT JOIN suivi s ON s.tache_id = t.id_tache
       WHERE p.contrat_id IN (?)
       GROUP BY p.id_projet
       ORDER BY p.date_debut DESC`,
      [contratIds]
    );

    // Récupérer les photos du chantier pour chaque projet
    const projetIds = projets.map(p => p.id_projet);
    const [photos] = await db.query(
      `SELECT id_photo, projet_id, tache_id, fichier, description AS desc_photo, date_prise
       FROM photo_chantier WHERE projet_id IN (?) ORDER BY date_prise DESC`,
      [projetIds]
    );

    // Récupérer les ressources de chaque projet
    const [ressources] = await db.query(
      `SELECT * FROM ressource WHERE projet_id IN (?)`,
      [projetIds]
    );

    // Récupérer les tâches avec leur dernier pourcentage de suivi
    const [taches] = await db.query(
      `SELECT t.*, COALESCE(s.pourcentage, 0) AS pourcentage
       FROM tache t
       LEFT JOIN suivi s ON s.tache_id = t.id_tache
         AND s.date_creation = (SELECT MAX(s2.date_creation) FROM suivi s2 WHERE s2.tache_id = t.id_tache)
       WHERE t.projet_id IN (?)
       ORDER BY t.id_tache`,
      [projetIds]
    );

    // Récupérer les dernières mises à jour (suivi)
    const [derniersSuivis] = await db.query(
      `SELECT s.*, t.titre AS tache_titre, t.projet_id
       FROM suivi s
       JOIN tache t ON s.tache_id = t.id_tache
       WHERE t.projet_id IN (?)
       ORDER BY s.date_creation DESC LIMIT 10`,
      [projetIds]
    );

    res.json({
      demandes,
      contrats,
      projets: projets.map(p => ({
        ...p,
        photos: photos.filter(ph => ph.projet_id === p.id_projet),
        taches: taches.filter(t => t.projet_id === p.id_projet),
        ressources: ressources.filter(r => r.projet_id === p.id_projet),
        suivis_recents: derniersSuivis.filter(s => s.projet_id === p.id_projet)
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
