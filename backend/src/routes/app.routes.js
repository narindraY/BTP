const express = require("express");
const router = express.Router();
//const passport = require("passport");
const passport = require("../config/passport")

const { register, loginUser, googleAuth } = require("../controllers/user.controller");
const { validateRegister } = require("../validation/user.validation");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const { createPub, listPub } = require("../controllers/publication.controller");
const {
  getBudgetInit,
  getSpendProject,
  getBalaceProject
} = require("../controllers/finance.controller");

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

router.get("/finance/budget", getBudgetInit);
router.get("/finance/spend", getSpendProject);
router.get("/finance/balance", getBalaceProject);

router.get("/admin", admin);

module.exports = router;