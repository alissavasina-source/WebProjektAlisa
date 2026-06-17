const express = require('express');
const controller = require('../controllers/bookingController');
const { requireTeam } = require('../middleware/auth');

const router = express.Router();

router.get('/', controller.showForm);
router.post('/', controller.create);
router.get('/uebersicht', requireTeam, controller.list);

module.exports = router;
