// models/Ghe.js
const mongoose = require('mongoose');

const gheSchema = new mongoose.Schema({
  maGhe: { type: String, required: true },  // Mã ghế (ví dụ: A1, B2, C3)
  loaiGhe: { type: String, enum: ['VIP', 'Thường'], required: true }  // Loại ghế (VIP hoặc Thường)
});

module.exports = mongoose.model('Ghe', gheSchema);
