const express = require('express');
const router = express.Router();
const selectedSeatByRoomController = require('../controllers/selectedSeatByRoomController');

router.get('/:phongId', selectedSeatByRoomController.getSelectedSeatByRoom);

module.exports = router;
