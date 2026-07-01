const express = require('express');
const bookingController = require('../controllers/bookingController');
const { requireTeam } = require('../middleware/auth');

const router = express.Router();

router.get('/', bookingController.showForm);
router.post('/', bookingController.create);

module.exports = router;
