// models/Rap.js
const mongoose = require('mongoose');

const rapSchema = new mongoose.Schema({
  ten: { type: String, required: true }, // Tên rạp
  diaChi: { type: String, required: true }, // Địa chỉ rạp
  urlImage: { type: String, required: true }, // Ảnh rạp
});

module.exports = mongoose.model('Rap', rapSchema);
