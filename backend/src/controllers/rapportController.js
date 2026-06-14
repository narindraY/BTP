const db = require("../config/db.narindra")
const PDFDocument = require("pdfkit");


exports.generateRapportJournalier = async (req, res) => {
  const { date } = req.query;

  const doc = new PDFDocument({ margin: 30, size: "A4" });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=rapport-journalier.pdf");

  doc.pipe(res);

  doc.fontSize(20).text("RAPPORT JOURNALIER", { align: "center" });
  doc.moveDown();

  const sql = `
    SELECT p.nom_projet, t.nom_tache, s.avancement, s.commentaire, s.photo, s.created_at
    FROM SUIVI s
    INNER JOIN TACHE t ON s.tache_id = t.id_tache
    INNER JOIN PROJET p ON t.projet_id = p.id_projet
    ORDER BY s.created_at DESC
  `;

  try {
    const [rows] = await db.query(sql);

    let y = 150;

    doc.rect(20, y, 560, 25).stroke();
    doc.text("Tâche", 30, y + 8);
    doc.text("Avancement", 140, y + 8);
    doc.text("Commentaire", 240, y + 8);
    doc.text("Date", 430, y + 8);

    y += 30;

    rows.forEach((row) => {
      doc.rect(20, y, 560, 60).stroke();

      doc.text(row.nom_tache, 30, y + 10);
      doc.text(`${row.avancement}%`, 140, y + 10);
      doc.text(row.commentaire || "", 240, y + 10, { width: 170 });
      doc.text(
        new Date(row.created_at).toLocaleDateString("fr-FR"),
        430,
        y + 10
      );

      y += 60;

      if (y > 700) {
        doc.addPage();
        y = 50;
      }
    });

    doc.end();

  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};


exports.generateRapportMensuel = (req, res) => {
  const { month, year } = req.query;
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=rapport-mensuel.pdf");
  doc.pipe(res);

  doc.fontSize(20).text("Rapport Mensuel", { align: "center" });
  doc.moveDown();

  const sql = `
    SELECT 
      COUNT(DISTINCT c.id_contrat) AS nb_contrats,
      COUNT(DISTINCT p.id_projet) AS nb_projets,
      COUNT(DISTINCT t.id_tache) AS nb_taches_terminees,
      AVG(s.avancement) AS moyenne_avancement,
      SUM(r.prix_unitaire * tr.quantite_utilisee) AS depenses_mois
    FROM CONTRAT c
    LEFT JOIN PROJET p ON p.contrat_id = c.id_contrat
    LEFT JOIN TACHE t ON t.projet_id = p.id_projet
    LEFT JOIN SUIVI s ON s.tache_id = t.id_tache
    LEFT JOIN TACHE_RESSOURCE tr ON tr.tache_id = t.id_tache
    LEFT JOIN RESSOURCE r ON r.id_ressource = tr.ressource_id
    WHERE MONTH(s.created_at) = ? AND YEAR(s.created_at) = ?;
  `;

  db.query(sql, [month, year], (err, rows) => {
    if (err) return res.status(500).send(err);

    const stats = rows[0];
    doc.fontSize(12).text(`Nombre de contrats: ${stats.nb_contrats}`);
    doc.fontSize(12).text(`Nombre de projets: ${stats.nb_projets}`);
    doc.fontSize(12).text(`Nombre de tâches terminées: ${stats.nb_taches_terminees}`);
    doc.fontSize(12).text(`Moyenne d'avancement: ${stats.moyenne_avancement || 0}%`);
    doc.fontSize(12).text(`Dépenses du mois: ${stats.depenses_mois || 0} FCFA`);

    doc.end();
  });
};


exports.generateRapportFinancier = (req, res) => {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=rapport-financier.pdf");
  doc.pipe(res);

  doc.fontSize(20).text("Rapport Financier", { align: "center" });
  doc.moveDown();

  const sql = `
    SELECT 
      c.id_contrat,
      c.type_contrat,
      c.budget,
      SUM(r.prix_unitaire * tr.quantite_utilisee) AS depenses,
      (c.budget - SUM(r.prix_unitaire * tr.quantite_utilisee)) AS reste_budget
    FROM CONTRAT c
    LEFT JOIN PROJET p ON p.contrat_id = c.id_contrat
    LEFT JOIN TACHE t ON t.projet_id = p.id_projet
    LEFT JOIN TACHE_RESSOURCE tr ON tr.tache_id = t.id_tache
    LEFT JOIN RESSOURCE r ON r.id_ressource = tr.ressource_id
    GROUP BY c.id_contrat, c.type_contrat, c.budget;
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).send(err);

    rows.forEach((c) => {
      doc.fontSize(12).text(
        `Contrat ID: ${c.id_contrat} | Type: ${c.type_contrat} | Budget: ${c.budget} | Dépenses: ${c.depenses || 0} | Reste: ${c.reste_budget || c.budget}`
      );
      doc.moveDown();
    });

    doc.end();
  });
};