const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController'); // 📌 Đảm bảo đúng đường dẫn

// Route GET: Hiển thị trang hồ sơ
router.get('/', profileController.hienThiHoSo);

// Route POST: Cập nhật hồ sơ (cả thông tin & ảnh đại diện)
router.post('/', profileController.uploadAvatar, profileController.capNhatHoSo);

module.exports = router;
