// models/SuatChieu.js
const mongoose = require('mongoose');

const suatChieuSchema = new mongoose.Schema({
    ngayGioBatDau: { type: Date, required: true },  // Ngày giờ bắt đầu
    ngayGioKetThuc: { type: Date, required: true },  // Ngày giờ bắt đầu
    thoiLuong: { type: Number }, // thời lượng phim (phút)
});

module.exports = mongoose.model('SuatChieu', suatChieuSchema);
