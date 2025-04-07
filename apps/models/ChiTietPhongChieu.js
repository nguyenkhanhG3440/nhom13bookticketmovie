// models/ChiTietPhongChieu.js
const mongoose = require('mongoose');

const chiTietPhongChieuSchema = new mongoose.Schema({
  phong: { type: mongoose.Schema.Types.ObjectId, ref: 'PhongChieu', required: true },
  ghe: { type: mongoose.Schema.Types.ObjectId, ref: 'Ghe', required: true },
  trangThai: { type: String, enum: ['Đã đặt', 'Chưa đặt', 'Đang chọn'], default: 'Chưa đặt' }
});

module.exports = mongoose.model('ChiTietPhongChieu', chiTietPhongChieuSchema);
