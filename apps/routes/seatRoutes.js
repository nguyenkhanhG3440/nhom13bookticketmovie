// routes/seatRoutes.js
const express = require('express');
const router = express.Router();
const gheController = require('../controllers/seatController');

// Route này xử lý yêu cầu hiển thị tất cả ghế
router.get('/', gheController.getAllGhe);

module.exports = router;
