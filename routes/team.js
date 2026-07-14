const express = require('express');
const controller = require('../controllers/teamController');
const { requireLogin, requireTeam } = require('../middleware/auth');

const router = express.Router();


router.get('/', controller.list);

router.get('/registrieren/me', requireLogin, requireTeam, controller.showRegister);
router.post('/registrieren/me', requireLogin, requireTeam, controller.register);
//router.get('/:id', controller.showMember);




module.exports = router;
