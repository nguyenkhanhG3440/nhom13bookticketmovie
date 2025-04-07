const ChiTietPhongChieu = require('../models/ChiTietPhongChieu');

exports.getSelectedSeatByRoom = async (req, res) => {
  const { phongId } = req.params;

  try {
    const danhSachGhe = await ChiTietPhongChieu.find({ phong: phongId })
      .populate('phong')
      .populate('ghe');

    res.render('selected-seat', { 
      danhSachGhe,
      phong: danhSachGhe.length ? danhSachGhe[0].phong : null,
      user: req.session.user 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi lấy danh sách ghế theo phòng');
  }
};
