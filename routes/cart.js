const express = require('express');
const controller = require('../controllers/productsController');
const { requireLogin } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireLogin, controller.showCart);
router.post('/checkout', requireLogin, controller.checkout);
router.post('/:id/entfernen', requireLogin, controller.removeFromCart);

router.post("/:id/plus", (req, res) => {
  const cart = req.session.cart || [];
  const item = cart.find(p => p.productId === req.params.id);

  if (item) {
    item.quantity++;
  }

  res.redirect("/warenkorb");
});

router.post("/:id/minus", (req, res) => {
  const cart = req.session.cart || [];
  const item = cart.find(p => p.productId === req.params.id);

  if (item && item.quantity > 1) {
    item.quantity--;
  }

  res.redirect("/warenkorb");
});

module.exports = router;
