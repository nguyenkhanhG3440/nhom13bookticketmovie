// models/ChiTietThongTinPhim.js
const mongoose = require('mongoose');

const chiTietThongTinPhimSchema = new mongoose.Schema({
  phim: { type: mongoose.Schema.Types.ObjectId, ref: 'Phim', required: true }, 
  rap: { type: mongoose.Schema.Types.ObjectId, ref: 'Rap', required: true },  
  phong: { type: mongoose.Schema.Types.ObjectId, ref: 'PhongChieu', required: true },  
  suatChieu: { type: mongoose.Schema.Types.ObjectId, ref: 'SuatChieu', required: true },  
});

module.exports = mongoose.model('ChiTietThongTinPhim', chiTietThongTinPhimSchema);
