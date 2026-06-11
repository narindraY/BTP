const express = require("express");
const passport = require("passport");
const router = express.Router();
const generateToken = require("../utils/generateToken");
const{register, loginUser} = require("../controllers/user.controller");
const {validateRegister} = require("../validation/user.validation");
const auth = require("../middleware/auth");
const {createPub, listPub} = require("../controllers/publication.controller");
const {getBudgetInit, getSpendProject, getBalaceProject} = require("../controllers/finance.controller")
const admin = require("../middleware/admin")
const upload = require("../config/multer");

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    res.json({ user: req.user });
  }
);

//auth - user
router.post("/user/register", validateRegister, register);
router.post("/user/login", loginUser);
router.get("/user/profile", auth, (req, res)=>{res.json(req.user)});

//pub
router.post("/publication/create",upload.single("img") ,createPub);
router.get("/publication/list", listPub)

//finance
router.get("/finance/budget", getBudgetInit);
router.get("/finance/spend", getSpendProject);
router.get("/finance/balance", getBalaceProject);
router.get("/", admin)






module.exports = router;

