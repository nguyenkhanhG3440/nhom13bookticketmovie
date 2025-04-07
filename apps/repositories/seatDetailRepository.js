// repositories/seatDetailRepository.js
const ChiTietPhongChieu = require('../models/ChiTietPhongChieu');

exports.getSeatsByRoom = async (phongChieuId) => {
  return await ChiTietPhongChieu.find({ phongChieu: phongChieuId }).populate('ghe');
};
