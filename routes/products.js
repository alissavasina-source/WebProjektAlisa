const express = require('express');
const controller = require('../controllers/productsController');
const { requireLogin, requireTeam } = require('../middleware/auth');

const router = express.Router();

router.get('/', controller.list);
router.post('/:id/warenkorb', requireLogin, controller.addToCart);
router.get('/:id', controller.details);

module.exports = router;
