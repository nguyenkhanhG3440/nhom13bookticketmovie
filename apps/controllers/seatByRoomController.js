const ChiTietPhongChieu = require('../models/ChiTietPhongChieu');

exports.hienThiTatCaGheTrongPhong = async (req, res) => {
    try {
        const danhSachChiTietPhongChieu = await ChiTietPhongChieu.find()
            .populate('phong')
            .populate('ghe');

        res.render('seat-by-room/seat-by-room', {
            danhSachChiTietPhongChieu,
            user: req.session.user || null
        });
    } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách chi tiết phòng chiếu:", error);
        res.status(500).send("Lỗi server khi lấy dữ liệu chi tiết phòng chiếu.");
    }
};
