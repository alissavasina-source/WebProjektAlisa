const express = require('express');
const controller = require('../controllers/servicesController');
const { requireTeam } = require('../middleware/auth');

const router = express.Router();

router.get('/', controller.list);


module.exports = router;
