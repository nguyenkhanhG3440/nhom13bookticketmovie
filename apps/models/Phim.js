const mongoose = require('mongoose');

const PhimSchema = new mongoose.Schema({
  title: { type: String, required: true },
  posterUrl: { type: String, required: true },
  description: { type: String },
  theLoai: { type: String }, // Ví dụ: "Hành động", "Tình cảm", "Hài", ...
  ngayKhoiChieu: { type: Date },
  thoiLuong: { type: Number }, // thời lượng phim (phút)
  daoDien: { type: String },
  dienVien: [{ type: String }],
  trailerUrl: { type: String },
  isHot: { type: Boolean, default: false }, // Đánh dấu phim nổi bật
  gia: { type: Number, required: true }, // Thêm trường giá vào
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Phim', PhimSchema);
