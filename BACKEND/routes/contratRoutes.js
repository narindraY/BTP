const express = require("express");
const router = express.Router();
const contratController = require("../controllers/contratController");


router.post("/", contratController.createContrat);


router.get("/", contratController.getContrats);


router.get("/:id", contratController.getContratById);


router.put("/:id", contratController.updateContrat);


router.delete("/:id", contratController.deleteContrat);

module.exports = router;
