const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/anmelden', authController.showLogin);
router.post('/anmelden', authController.login);
router.get('/registrieren', authController.showRegister);
router.post('/registrieren', authController.register);
router.post('/abmelden', authController.logout);

module.exports = router;
