const mongoose = require('mongoose');

const NguoiDungSchema = new mongoose.Schema({
  hoTen: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  matKhau: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Phân quyền
  ngaySinh: { type: Date, required: true }, // Ngày sinh
  ngayTao: { type: Date, default: Date.now }, // Ngày tạo tài khoản (mặc định là thời điểm đăng ký)
  gioiTinh: { type: String, enum: ['Nam', 'Nữ', 'Khác'], required: true }, // Giới tính
  soDienThoai: { type: String, required: true }, // Số điện thoại
  avatar: { type: String, default: '/images/avatar/default-avatar.png' } // Ảnh đại diện (URL)
});

module.exports = mongoose.model('NguoiDung', NguoiDungSchema);
