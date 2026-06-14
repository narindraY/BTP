const express = require("express");
const router = express.Router();
//const passport = require("passport");
const passport = require("../config/passport")

const { register, loginUser, googleAuth } = require("../controllers/user.controller");
const { validateRegister } = require("../validation/user.validation");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const { createPub, listPub } = require("../controllers/publication.controller");
const { postMessage, getHistory, getDiscussions, startDiscussion, uploadFile, editMessage, deleteMessage } = require("../controllers/chat.controller");
const {
  getBudgetInit,
  getSpendProject,
  getBalaceProject
} = require("../controllers/finance.controller");
const projectController = require('../controllers/projectController');
const dashboardController = require('../controllers/dashboardController');
const resourceController = require('../controllers/resourceController');
const suiviController = require("../controllers/suiviController");

const upload = require("../config/multer");

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


//Narindra
router.get('/projects',projectController.getAllProjects);
router.post('/',projectController.createProject);
router.get('/contrats', projectController.getAllContrats);
router.get('/:id/detail', projectController.getProjectDetail);
router.get('/:id/taches', projectController.getProjectTasks);
router.post('/:id/suivi', projectController.addSuivi);
router.get('/stats', dashboardController.getStats);
router.get('/ressource/getall', resourceController.getAllResources);
router.post('/', resourceController.addResource);
router.put('/:id', resourceController.updateResource);
router.delete('/:id', resourceController.deleteResource);
//Nante
router.post("/", upload.single("photo"), suiviController.createSuivi);
router.get("/suivis", suiviController.getSuivis);
router.get("/id/:id", suiviController.getSuiviById);
router.put("/:id", upload.single("photo"), suiviController.updateSuivi);
router.delete("/:id", suiviController.deleteSuivi);

// Routes pour le Chat
router.get("/chat/discussions", auth, getDiscussions);
router.post("/chat/start", auth, startDiscussion);
router.post("/chat/send", auth, postMessage);
router.get("/chat/history", auth, getHistory);
router.post("/chat/upload", auth, upload.single("file"), uploadFile);
router.put("/chat/message/:id", auth, editMessage);
router.delete("/chat/message/:id", auth, deleteMessage);

router.get("/finance/budget", getBudgetInit);
router.get("/finance/spend", getSpendProject);
router.get("/finance/balance", getBalaceProject);

router.get("/admin", admin);

module.exports = router;