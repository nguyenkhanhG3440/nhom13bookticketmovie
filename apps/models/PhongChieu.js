// models/PhongChieu.js
const mongoose = require('mongoose');

const phongChieuSchema = new mongoose.Schema({
  tenPhong: { type: String, required: true }, // Tên phòng chiếu
  sucChua: { type: Number, required: true }, // Sức chứa phòng (Số ghế)
});

module.exports = mongoose.model('PhongChieu', phongChieuSchema);
