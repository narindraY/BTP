const express = require("express");
const router = express.Router();
const rapportController = require("../controllers/rapportController");


router.get("/journalier/pdf", rapportController.generateRapportJournalier);
router.get("/mensuel/pdf", rapportController.generateRapportMensuel);
router.get("/financier/pdf", rapportController.generateRapportFinancier);

module.exports = router;
