const express = require('express');
const controller = require('../controllers/teamController');
const { requireLogin, requireTeam } = require('../middleware/auth');

const router = express.Router();


router.get('/', controller.list);

router.get('/registrieren/me', requireLogin, requireTeam, controller.showRegister);
router.post('/registrieren/me', requireLogin, requireTeam, controller.register);
//router.post('/profil/aufgabe', requireLogin, requireTeam, controller.addTask);
//router.post('/profil/aufgabe/:taskId/toggle', requireLogin, requireTeam, controller.toggleTask);
//router.post('/profil/aufgabe/:taskId/loeschen', requireLogin, requireTeam, controller.removeTask);
//router.get('/:id', controller.showMember);
router.get('/profil/me', requireLogin, requireTeam, controller.showProfile);
router.post('/profil/me', requireLogin, requireTeam, controller.updateProfile);
router.post('/profil/aufgabe', requireLogin, requireTeam, controller.addTask);
router.post('/profil/aufgabe/:taskId/toggle', requireLogin, requireTeam, controller.toggleTask);
router.post('/profil/aufgabe/:taskId/loeschen', requireLogin, requireTeam, controller.removeTask);
router.get('/:id', controller.showMember);



module.exports = router;
