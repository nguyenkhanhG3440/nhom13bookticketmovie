// controllers/showtimeController.js
const showtimeRepo = require('../repositories/showtimeRepository');

exports.hienThiDanhSachSuatChieu = async (req, res) => {
  try {
    const danhSachSuatChieu = await showtimeRepo.getAllShowtimes();
    res.render('showtime/showtime', {
      danhSachSuatChieu,
      user: req.session.user || null
    });
  } catch (error) {
    console.error("❌ Lỗi khi lấy suất chiếu:", error);
    res.status(500).send("Không thể tải suất chiếu");
  }
};
