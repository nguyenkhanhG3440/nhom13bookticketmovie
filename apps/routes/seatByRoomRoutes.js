const express = require('express');
const router = express.Router();
const seatByRoomController = require('../controllers/seatByRoomController');

router.get('/', seatByRoomController.hienThiTatCaGheTrongPhong);

module.exports = router;
