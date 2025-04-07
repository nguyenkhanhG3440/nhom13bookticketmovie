const express = require('express');
const router = express.Router();
const theaterController = require('../controllers/theaterController');

router.get('/', theaterController.getAllTheaters);

module.exports = router;
