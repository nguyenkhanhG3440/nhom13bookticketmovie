const PhongChieu = require('../models/PhongChieu');

exports.hienThiDanhSachRoom = async (req, res) => {
    try {
        const danhSachRoom = await PhongChieu.find();
        res.render('room/room', {
            danhSachRoom,
            user: req.session.user || null
        });
    } catch (error) {
        console.error(" Lỗi khi lấy danh sách room:", error);
        res.status(500).send("Lỗi khi tải room");
    }
};
