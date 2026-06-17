const express = require('express');
const controller = require('../controllers/productsController');
const { requireLogin, requireTeam } = require('../middleware/auth');

const router = express.Router();

router.get('/', controller.list);
router.post('/', requireTeam, controller.create);
router.post('/:id/bearbeiten', requireTeam, controller.update);
router.post('/:id/loeschen', requireTeam, controller.remove);
router.post('/:id/warenkorb', requireLogin, controller.addToCart);

module.exports = router;
