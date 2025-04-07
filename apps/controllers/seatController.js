// controllers/gheController.js
const Ghe = require('../models/Ghe');

exports.getAllGhe = async (req, res) => {
    try {
        const ghes = await Ghe.find(); // Lấy tất cả ghế từ cơ sở dữ liệu
        res.render('seat/seat', {
            ghes,
            user: req.session.user || null
        });
    } catch (error) {
        console.error('Lỗi khi tải danh sách ghế:', error);
        res.status(500).send('Không thể lấy danh sách ghế');
    }
};
