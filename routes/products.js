const express = require('express');
const controller = require('../controllers/productsController');
const { requireLogin, requireTeam } = require('../middleware/auth');

const router = express.Router();

router.get('/', controller.list);
router.post('/', requireTeam, controller.create);
router.post('/:id/bearbeiten', requireTeam, controller.update);
router.post('/:id/loeschen', requireTeam, controller.remove);
router.post('/:id/warenkorb', requireLogin, controller.addToCart);
router.get('/:id', controller.details);

/*für plus */
router.post("/:id/plus", (req, res) => {
const cart = req.session.cart || [];
    const item = cart.find(
        p => p.productId === req.params.id
    );

    if(item){
        item.quantity++;
    }

    res.redirect("/warenkorb");
});

/*für minus */
router.post("/:id/minus", (req, res) => {
const cart = req.session.cart || [];
    const item = cart.find(
        p => p.productId === req.params.id
    );

    if(item && item.quantity > 1){
        item.quantity--;
    }

    res.redirect("/warenkorb");
});
module.exports = router;
