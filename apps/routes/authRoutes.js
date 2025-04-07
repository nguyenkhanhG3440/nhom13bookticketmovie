const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Giao diện đăng ký
router.get('/dangky', (req, res) => {
    res.render('dangky', { message: req.session.message });
    req.session.message = null; // Reset message sau khi render
});

// Route đăng ký
router.post('/dangky', authController.dangKy);


// Giao diện đăng nhập
router.get('/dangnhap', (req, res) => {
    res.render('login', {
        message: req.session.message,
        user: null  // ✅ thêm dòng này đúng cú pháp
    });
    req.session.message = null;
});

// Route đăng nhập
router.post('/dangnhap', authController.dangNhap);

router.get('/dangxuat', (req, res) => {
    req.session.destroy(); // Xóa session
    res.clearCookie('token'); // Xóa cookie
    res.redirect('/auth/dangnhap');
});



module.exports = router;
