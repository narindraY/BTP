const express = require("express");
const router = express.Router();
//const passport = require("passport");
const passport = require("../config/passport")

const { register, loginUser, googleAuth } = require("../controllers/user.controller");
const { validateRegister } = require("../validation/user.validation");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { createPub, listPub } = require("../controllers/publication.controller");
const {getBudgetInit,getSpendProject,getBalaceProject} = require("../controllers/finance.controller");
const upload = require("../config/multer");
//Narindra
const dashboardController = require('../controllers/dashboardController');
const projectController = require('../controllers/projectController');
const resourceController = require('../controllers/resourceController');
//Nante
const contratController = require("../controllers/contratController");
const rapportController = require("../controllers/rapportController");
const suiviController = require("../controllers/suiviController");
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

router.get(
  "/auth/google/callback",
  (req, res, next) => {
    next();
  },
  passport.authenticate("google", { session: false }),
  googleAuth
);


router.post("/user/register", validateRegister, register);
router.post("/user/login", loginUser);
router.get("/user/profile", auth, (req, res) => res.json(req.user));
router.post("/publication/create", upload.single("img"), createPub);
router.get("/publication/list", listPub);
router.get("/finance/budget", getBudgetInit);
router.get("/finance/spend", getSpendProject);
router.get("/finance/balance", getBalaceProject);
router.get("/admin", admin);


//Narindra
router.get('/stats', dashboardController.getStats);
router.get('/projects', projectController.getAllProjects);
router.post('/', projectController.createProject);
router.get('/contrats', projectController.getAllContrats);
router.get('/:id/detail', projectController.getProjectDetail);
router.get('/:id/taches', projectController.getProjectTasks);
router.post('/:id/suivi', projectController.addSuivi);
router.get('/ressource/getall', resourceController.getAllResources);
router.post('/ressource/create', resourceController.addResource);
router.put('/ressource/update/:id', resourceController.updateResource);
router.delete('/ressource/delete/:id', resourceController.deleteResource);


//Nante

router.post("/contrat/create", contratController.createContrat);
router.get("/contrat/get", contratController.getContrats);
router.get("/contrats/:id", contratController.getContratById);
router.put("/contrats/update/:id", contratController.updateContrat);
router.delete("/delete/contrats/:id", contratController.deleteContrat);

router.get("/rapports/journalier/pdf", rapportController.generateRapportJournalier);
router.get("/mensuel/pdf", rapportController.generateRapportMensuel);
router.get("/financier/pdf", rapportController.generateRapportFinancier);

router.get("/suivis", suiviController.getSuivis);
router.get("/suivis/:id", suiviController.getSuiviById);
router.post("/suivis", suiviController.createSuivi);
router.put("/suivis/:id", upload.single("photo"), suiviController.updateSuivi);
router.delete("/suivis/:id", suiviController.deleteSuivi);



module.exports = router;