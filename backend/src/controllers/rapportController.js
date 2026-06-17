const db = require("../config/db.nante");
const PDFDocument = require("pdfkit");

// ─── HELPER : promisifie db.query (sans toucher à db.nante.js) ──────────────
/**
 * db.nante.js utilise mysql2 en mode callback (mysql.createConnection),
 * donc db.query() ne retourne PAS une Promise par défaut.
 * Cette fonction l'enveloppe proprement pour pouvoir faire await db.query(...).
 */
function queryAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

// ─── COULEURS & CONSTANTES ───────────────────────────────────────────────────
const COLORS = {
  primary:    "#1a3c5e",   // Bleu marine foncé
  secondary:  "#2e86c1",   // Bleu moyen
  accent:     "#f39c12",   // Jaune/orange
  light:      "#eaf4fb",   // Bleu très clair (fond alternance)
  white:      "#ffffff",
  text:       "#2c3e50",
  muted:      "#7f8c8d",
  border:     "#aed6f1",
  success:    "#27ae60",
  danger:     "#e74c3c",
};

const PAGE_W = 595.28;  // A4 width en points
const MARGIN  = 40;
const COL_W   = PAGE_W - MARGIN * 2;

// ─── HELPERS PDF ─────────────────────────────────────────────────────────────

/** Dessine l'en-tête commun à tous les rapports */
function drawHeader(doc, title, subtitle = "") {
  // Bande de fond
  doc.rect(0, 0, PAGE_W, 90).fill(COLORS.primary);

  // Ligne décorative accent
  doc.rect(0, 90, PAGE_W, 5).fill(COLORS.accent);

  // Titre
  doc
    .fillColor(COLORS.white)
    .fontSize(22)
    .font("Helvetica-Bold")
    .text(title, MARGIN, 24, { align: "center", width: COL_W });

  if (subtitle) {
    doc
      .fillColor(COLORS.accent)
      .fontSize(11)
      .font("Helvetica")
      .text(subtitle, MARGIN, 56, { align: "center", width: COL_W });
  }

  // Date de génération
  const now = new Date().toLocaleString("fr-FR");
  doc
    .fillColor(COLORS.muted)
    .fontSize(8)
    .font("Helvetica")
    .text(`Généré le : ${now}`, MARGIN, 78, { align: "right", width: COL_W });

  doc.moveDown(0.5);
}

/** Dessine un pied de page avec numéro de page */
function drawFooter(doc, pageNum) {
  const y = doc.page.height - 30;
  doc.rect(0, y - 8, PAGE_W, 30).fill(COLORS.primary);
  doc
    .fillColor(COLORS.white)
    .fontSize(8)
    .font("Helvetica")
    .text(`Page ${pageNum}`, MARGIN, y, { align: "right", width: COL_W });
  doc
    .fillColor(COLORS.accent)
    .text("Système de Gestion – Rapport confidentiel", MARGIN, y, { align: "left", width: COL_W });
}

/** Dessine une carte de statistique (kpi) */
function drawKpiCard(doc, x, y, w, h, label, value, color = COLORS.secondary) {
  // Fond
  doc.roundedRect(x, y, w, h, 6).fill(COLORS.light);
  // Barre latérale colorée
  doc.rect(x, y, 4, h).fill(color);
  // Valeur
  doc.fillColor(color).fontSize(20).font("Helvetica-Bold").text(value, x + 14, y + 8, { width: w - 20, align: "center" });
  // Label
  doc.fillColor(COLORS.muted).fontSize(9).font("Helvetica").text(label, x + 14, y + h - 20, { width: w - 20, align: "center" });
}

/** Convertit une valeur numérique en affichage FCFA */
function fcfa(val) {
  return Number(val || 0).toLocaleString("fr-FR") + " FCFA";
}

// ─── RAPPORT JOURNALIER ───────────────────────────────────────────────────────
/**
 * Sans table TACHE : on liste les suivis avec projet + commentaire + avancement
 */
exports.generateRapportJournalier = async (req, res) => {
  const { date } = req.query;
  const dateLabel = date
    ? new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
    : new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

  // ── Requête sans TACHE ──
  const whereClause = date ? "WHERE DATE(s.created_at) = ?" : "";
  const params      = date ? [date] : [];

  const sql = `
    SELECT
      p.nom_projet,
      s.avancement,
      s.commentaire,
      s.created_at
    FROM SUIVI s
    INNER JOIN PROJET p ON s.projet_id = p.id_projet
    ${whereClause}
    ORDER BY s.created_at DESC
  `;

  // ── 1) On exécute la requête AVANT de toucher au PDF / aux headers ──
  let rows;
  try {
    rows = await queryAsync(sql, params);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }

  // ── 2) La requête a réussi : on peut générer le PDF sans risque ──
  const doc = new PDFDocument({ margin: MARGIN, size: "A4", autoFirstPage: true });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=rapport-journalier-${date || "today"}.pdf`);
  doc.pipe(res);

  drawHeader(doc, "RAPPORT JOURNALIER", `Date : ${dateLabel}`);

  let y = 115;
  let pageNum = 1;

  if (rows.length === 0) {
    doc.fillColor(COLORS.muted).fontSize(12).font("Helvetica-Oblique")
      .text("Aucune donnée disponible pour cette date.", MARGIN, y, { align: "center", width: COL_W });
    drawFooter(doc, pageNum);
    doc.end();
    return;
  }

  // ─ Tableau header ─
  const COL = { projet: 30, avance: 280, commentaire: 340, date: 470 };
  const ROW_H = 24;

  const drawTableHeader = (yPos) => {
    doc.rect(MARGIN, yPos, COL_W, ROW_H).fill(COLORS.secondary);
    doc.fillColor(COLORS.white).fontSize(10).font("Helvetica-Bold");
    doc.text("Projet",       COL.projet,     yPos + 7, { width: 240 });
    doc.text("Avanc.",       COL.avance,     yPos + 7, { width: 55 });
    doc.text("Commentaire",  COL.commentaire,yPos + 7, { width: 125 });
    doc.text("Date",         COL.date,       yPos + 7, { width: 90 });
    return yPos + ROW_H;
  };

  y = drawTableHeader(y);

  rows.forEach((row, idx) => {
    // Gestion saut de page
    if (y > doc.page.height - 70) {
      drawFooter(doc, pageNum);
      doc.addPage();
      pageNum++;
      y = MARGIN;
      y = drawTableHeader(y);
    }

    // Alternance fond
    const bg = idx % 2 === 0 ? COLORS.white : COLORS.light;
    doc.rect(MARGIN, y, COL_W, ROW_H).fill(bg);

    // Barre de progression avancement
    const pct   = Math.min(parseFloat(row.avancement) || 0, 100);
    const barW  = 50;
    const barX  = COL.avance;
    const barY  = y + 8;
    doc.rect(barX, barY, barW, 8).fill("#dce8f5");
    const fillColor = pct >= 80 ? COLORS.success : pct >= 40 ? COLORS.secondary : COLORS.danger;
    doc.rect(barX, barY, (barW * pct) / 100, 8).fill(fillColor);

    // Textes
    doc.fillColor(COLORS.text).fontSize(9).font("Helvetica");
    doc.text(row.nom_projet || "—",   COL.projet,      y + 7, { width: 240, ellipsis: true });
    doc.text(`${pct}%`,               barX + barW + 4, y + 7, { width: 28 });
    doc.text(row.commentaire || "—",  COL.commentaire, y + 7, { width: 125, ellipsis: true });
    doc.text(
      new Date(row.created_at).toLocaleDateString("fr-FR"),
      COL.date, y + 7, { width: 90 }
    );

    // Ligne séparatrice légère
    doc.moveTo(MARGIN, y + ROW_H).lineTo(MARGIN + COL_W, y + ROW_H)
      .strokeColor(COLORS.border).lineWidth(0.5).stroke();

    y += ROW_H;
  });

  // Total suivis
  doc.moveDown(1);
  doc.fillColor(COLORS.muted).fontSize(9).font("Helvetica-Oblique")
    .text(`Total : ${rows.length} suivi(s)`, MARGIN, y + 8, { align: "right", width: COL_W });

  drawFooter(doc, pageNum);
  doc.end();
};

// ─── RAPPORT MENSUEL ─────────────────────────────────────────────────────────
/**
 * Sans table TACHE ni PROJET_RESSOURCE : statistiques sur CONTRAT, PROJET, SUIVI
 * (les dépenses ne sont plus calculées, faute de source de données)
 */
exports.generateRapportMensuel = async (req, res) => {
  const { month, year } = req.query;
  const monthLabel = new Date(`${year}-${month}-01`).toLocaleString("fr-FR", { month: "long", year: "numeric" });

  const sql = `
    SELECT
      COUNT(DISTINCT c.id_contrat)  AS nb_contrats,
      COUNT(DISTINCT p.id_projet)   AS nb_projets,
      AVG(s.avancement)             AS moyenne_avancement
    FROM CONTRAT c
    LEFT JOIN PROJET p   ON p.contrat_id = c.id_contrat
    LEFT JOIN SUIVI s    ON s.projet_id  = p.id_projet
    WHERE MONTH(s.created_at) = ? AND YEAR(s.created_at) = ?
  `;

  const sql2 = `
    SELECT
      p.nom_projet,
      COUNT(DISTINCT s.id_suivi)  AS nb_suivis,
      AVG(s.avancement)           AS moy_avancement
    FROM PROJET p
    LEFT JOIN SUIVI s ON s.projet_id = p.id_projet
      AND MONTH(s.created_at) = ? AND YEAR(s.created_at) = ?
    GROUP BY p.id_projet, p.nom_projet
    ORDER BY moy_avancement DESC
  `;

  // ── 1) Toutes les requêtes AVANT de créer le PDF ──
  let rows, projets;
  try {
    rows    = await queryAsync(sql, [month, year]);
    projets = await queryAsync(sql2, [month, year]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }

  // ── 2) Génération du PDF ──
  const doc = new PDFDocument({ margin: MARGIN, size: "A4" });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=rapport-mensuel-${month}-${year}.pdf`);
  doc.pipe(res);

  drawHeader(doc, "RAPPORT MENSUEL", monthLabel.toUpperCase());

  const stats = rows[0] || {};
  let y = 115;

  // ── Section KPI (3 cartes désormais, plus de "Dépenses") ──
  doc.fillColor(COLORS.primary).fontSize(13).font("Helvetica-Bold")
    .text("Vue d'ensemble du mois", MARGIN, y);
  y += 20;

  const cardW = (COL_W - 10) / 3;
  drawKpiCard(doc, MARGIN,               y, cardW, 70, "Contrats",    stats.nb_contrats || 0,                          COLORS.primary);
  drawKpiCard(doc, MARGIN + cardW + 5,   y, cardW, 70, "Projets",     stats.nb_projets || 0,                           COLORS.secondary);
  drawKpiCard(doc, MARGIN + (cardW+5)*2, y, cardW, 70, "Moy. avanc.", `${Math.round(stats.moyenne_avancement || 0)}%`, COLORS.accent);

  y += 90;

  // ── Répartition par projet ──
  doc.fillColor(COLORS.primary).fontSize(13).font("Helvetica-Bold")
    .text("Répartition par projet", MARGIN, y);
  y += 18;

  // Tableau header (Projet / Nb suivis / Avancement — plus de colonne Dépenses)
  doc.rect(MARGIN, y, COL_W, 22).fill(COLORS.secondary);
  doc.fillColor(COLORS.white).fontSize(9).font("Helvetica-Bold");
  doc.text("Projet",     MARGIN + 5,   y + 6, { width: 220 });
  doc.text("Nb suivis",  MARGIN + 235, y + 6, { width: 80, align: "center" });
  doc.text("Avancement", MARGIN + 330, y + 6, { width: 150 });
  y += 22;

  projets.forEach((p, idx) => {
    if (y > doc.page.height - 70) { doc.addPage(); y = MARGIN; }
    const bg = idx % 2 === 0 ? COLORS.white : COLORS.light;
    doc.rect(MARGIN, y, COL_W, 22).fill(bg);

    const pct  = Math.round(p.moy_avancement || 0);
    const barX = MARGIN + 330;
    doc.rect(barX, y + 7, 90, 7).fill("#dce8f5");
    const fc = pct >= 80 ? COLORS.success : pct >= 40 ? COLORS.secondary : COLORS.danger;
    doc.rect(barX, y + 7, (90 * pct) / 100, 7).fill(fc);

    doc.fillColor(COLORS.text).fontSize(9).font("Helvetica");
    doc.text(p.nom_projet || "—",  MARGIN + 5,   y + 6, { width: 220, ellipsis: true });
    doc.text(String(p.nb_suivis),  MARGIN + 235, y + 6, { width: 80, align: "center" });
    doc.text(`${pct}%`,            barX + 96,    y + 6, { width: 30 });

    doc.moveTo(MARGIN, y + 22).lineTo(MARGIN + COL_W, y + 22)
      .strokeColor(COLORS.border).lineWidth(0.5).stroke();
    y += 22;
  });

  drawFooter(doc, 1);
  doc.end();
};

// ─── RAPPORT FINANCIER ────────────────────────────────────────────────────────
/**
 * Sans table TACHE ni PROJET_RESSOURCE : synthèse budgétaire par contrat
 * (dépenses / reste budget / taux de consommation supprimés, faute de source de données)
 */
exports.generateRapportFinancier = async (req, res) => {
  const sql = `
    SELECT
      c.id_contrat,
      c.type_contrat,
      c.budget,
      COUNT(DISTINCT p.id_projet) AS nb_projets
    FROM CONTRAT c
    LEFT JOIN PROJET p ON p.contrat_id = c.id_contrat
    GROUP BY c.id_contrat, c.type_contrat, c.budget
    ORDER BY c.id_contrat
  `;

  // ── 1) Requête AVANT de créer le PDF ──
  let rows;
  try {
    rows = await queryAsync(sql);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }

  // ── 2) Génération du PDF ──
  const doc = new PDFDocument({ margin: MARGIN, size: "A4" });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=rapport-financier.pdf");
  doc.pipe(res);

  drawHeader(doc, "RAPPORT FINANCIER", "Synthèse budgétaire par contrat");

  let y = 115;
  let pageNum = 1;

  // ── KPI globaux (3 cartes : Budget total / Nb contrats / Nb projets) ──
  const totalBudget = rows.reduce((s, r) => s + (parseFloat(r.budget) || 0), 0);
  const nbContrats  = rows.length;
  const nbProjets   = rows.reduce((s, r) => s + (parseInt(r.nb_projets, 10) || 0), 0);

  const cardW = (COL_W - 10) / 3;
  drawKpiCard(doc, MARGIN,               y, cardW, 70, "Budget total",  fcfa(totalBudget), COLORS.primary);
  drawKpiCard(doc, MARGIN + cardW + 5,   y, cardW, 70, "Contrats",      nbContrats,         COLORS.secondary);
  drawKpiCard(doc, MARGIN + (cardW+5)*2, y, cardW, 70, "Projets liés",  nbProjets,           COLORS.accent);

  y += 90;

  // ── Tableau détail ──
  doc.fillColor(COLORS.primary).fontSize(13).font("Helvetica-Bold")
    .text("Détail par contrat", MARGIN, y);
  y += 18;

  // Header tableau (ID / Type / Budget / Nb projets — plus de colonnes dépenses)
  doc.rect(MARGIN, y, COL_W, 24).fill(COLORS.primary);
  doc.fillColor(COLORS.white).fontSize(9).font("Helvetica-Bold");
  doc.text("ID",         MARGIN + 5,   y + 7, { width: 40 });
  doc.text("Type",       MARGIN + 50,  y + 7, { width: 200 });
  doc.text("Budget",     MARGIN + 260, y + 7, { width: 150, align: "right" });
  doc.text("Nb projets", MARGIN + 420, y + 7, { width: 95,  align: "center" });
  y += 24;

  rows.forEach((c, idx) => {
    if (y > doc.page.height - 70) {
      drawFooter(doc, pageNum);
      doc.addPage();
      pageNum++;
      y = MARGIN;
    }

    const bg = idx % 2 === 0 ? COLORS.white : COLORS.light;
    doc.rect(MARGIN, y, COL_W, 24).fill(bg);

    doc.fillColor(COLORS.text).fontSize(9).font("Helvetica");
    doc.text(`#${c.id_contrat}`,    MARGIN + 5,   y + 7, { width: 40 });
    doc.text(c.type_contrat || "—", MARGIN + 50,  y + 7, { width: 200, ellipsis: true });
    doc.text(fcfa(c.budget),        MARGIN + 260, y + 7, { width: 150, align: "right" });
    doc.text(String(c.nb_projets),  MARGIN + 420, y + 7, { width: 95,  align: "center" });

    doc.moveTo(MARGIN, y + 24).lineTo(MARGIN + COL_W, y + 24)
      .strokeColor(COLORS.border).lineWidth(0.5).stroke();

    y += 24;
  });

  // Ligne totaux
  y += 4;
  doc.rect(MARGIN, y, COL_W, 26).fill(COLORS.primary);
  doc.fillColor(COLORS.white).fontSize(10).font("Helvetica-Bold");
  doc.text("TOTAL",             MARGIN + 5,   y + 7, { width: 245 });
  doc.text(fcfa(totalBudget),   MARGIN + 260, y + 7, { width: 150, align: "right" });
  doc.text(String(nbProjets),   MARGIN + 420, y + 7, { width: 95,  align: "center" });

  drawFooter(doc, pageNum);
  doc.end();
};