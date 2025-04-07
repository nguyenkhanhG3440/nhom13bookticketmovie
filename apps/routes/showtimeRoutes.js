// routes/showtimeRoutes.js
const express = require('express');
const router = express.Router();
const showtimeController = require('../controllers/showtimeController');

router.get('/', showtimeController.hienThiDanhSachSuatChieu);

module.exports = router;
