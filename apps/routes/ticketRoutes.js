const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/TicketController');

// Định nghĩa route cho thống kê doanh thu
router.get('/', TicketController.renderDoanhThuView);  // Route này sẽ render view doanh thu

module.exports = router;
