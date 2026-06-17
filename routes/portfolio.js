const express = require('express');
const multer = require('multer');
const path = require('path');
const config = require('../config/config');
const controller = require('../controllers/portfolioController');
const { requireTeam } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: config.uploadDir,
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext && mime);
  }
});

const router = express.Router();

router.get('/', controller.list);
router.post('/', requireTeam, upload.single('image'), controller.create);
router.post('/:id/loeschen', requireTeam, controller.remove);

module.exports = router;
