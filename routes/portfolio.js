const express = require('express');
const multer = require('multer');
const path = require('path');
const config = require('../config/config');
const controller = require('../controllers/portfolioController');
const { requireTeam } = require('../middleware/auth');



const router = express.Router();

router.get('/', controller.list);
module.exports = router;
/*
const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

// Wenn jemand /portfolio aufruft, starte die Funktion aus dem Controller
router.get('/portfolio', portfolioController.showPortfolio);

module.exports = router;
*/