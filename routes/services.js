const express = require('express');
const controller = require('../controllers/servicesController');
const { requireTeam } = require('../middleware/auth');

const router = express.Router();

router.get('/', controller.list);
router.post('/', requireTeam, controller.create);
router.post('/:id/bearbeiten', requireTeam, controller.update);
router.post('/:id/loeschen', requireTeam, controller.remove);

module.exports = router;
