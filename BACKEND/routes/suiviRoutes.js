const express = require("express");
const router = express.Router();
const suiviController = require("../controllers/suiviController");
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });


router.post("/", upload.single("photo"), suiviController.createSuivi);
router.get("/", suiviController.getSuivis);
router.get("/id/:id", suiviController.getSuiviById);
router.put("/:id", upload.single("photo"), suiviController.updateSuivi);
router.delete("/:id", suiviController.deleteSuivi);

module.exports = router;
