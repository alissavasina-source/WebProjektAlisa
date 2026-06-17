const express = require('express');
const controller = require('../controllers/productsController');
const { requireLogin } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireLogin, controller.showCart);
router.post('/checkout', requireLogin, controller.checkout);
router.post('/:id/entfernen', requireLogin, controller.removeFromCart);

module.exports = router;
