const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.get('/', roomController.hienThiDanhSachRoom);

module.exports = router;
