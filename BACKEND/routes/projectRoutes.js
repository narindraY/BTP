const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.get('/',              projectController.getAllProjects);
router.post('/',             projectController.createProject);
router.get('/contrats',      projectController.getAllContrats);
router.get('/:id/detail',   projectController.getProjectDetail);
router.get('/:id/taches',   projectController.getProjectTasks);
router.post('/:id/suivi',   projectController.addSuivi);

module.exports = router;