const express = require('express');
const controller = require('../controllers/adminController');
const { requireLogin, requireTeam } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config/config');
const router = express.Router();


// 1. Profil
const teamStorage = multer.diskStorage({
  destination: (_req, _file, cb) => { cb(null, './public/uploadsTeam'); },
  filename: (_req, file, cb) => {
    cb(null, `profile-${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});
const uploadTeam = multer({ storage: teamStorage });
//router.get('/profile', requireLogin, requireTeam, controller.showProfile);
router.get('/profile',requireTeam, controller.showProfile);
router.post('/profile', requireLogin, requireTeam,uploadTeam.single('profileImage'), controller.updateProfile);

// 2. Buchungen
router.get('/list', requireLogin, requireTeam, controller.showBookingList);
router.post('/termin/stornieren/:id', requireLogin, requireTeam, controller.deleteAppointment);


// 4. Produkte
const produktStorage = multer.diskStorage({
  destination: (_req, _file, cb) => { cb(null, './public/uploadsProduct'); },
  filename: (_req, file, cb) => {
    cb(null, `produkt-${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});
const uploadProdukt = multer({ storage: produktStorage });
router.get('/produkt', requireLogin, requireTeam, controller.showProducts);
router.post('/produkt/neu', requireLogin, requireTeam, uploadProdukt.single('image'), controller.createProduct);
router.post('/produkt/:id/bearbeiten', requireLogin, requireTeam, uploadProdukt.single('image'), controller.updateProduct);
router.post('/produkt/:id/loeschen', requireLogin, requireTeam, controller.removeProduct);

// 5. Services
router.get('/services', requireLogin, requireTeam, controller.listServices);
router.post('/services/neu', requireLogin, requireTeam, controller.createService);
router.post('/services/:id/bearbeiten', requireLogin, requireTeam, controller.updateService);
router.post('/services/:id/loeschen', requireLogin, requireTeam, controller.removeService);

//home
router.get('/home', requireLogin, requireTeam, controller.showAdminHome);
router.post('/home/bearbeiten', requireLogin, requireTeam, uploadProdukt.single('heroImage'), controller.updateHome);

module.exports = router;
