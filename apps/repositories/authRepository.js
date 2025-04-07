const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NguoiDung = require('../models/NguoiDung');
require('dotenv').config();

class AuthRepository {
  async dangKy(userData) {
    const { hoTen, email, matKhau, role, ngaySinh, gioiTinh, soDienThoai } = userData;

    // Kiểm tra email đã tồn tại chưa
    const userExist = await NguoiDung.findOne({ email });
    if (userExist) throw new Error("Email đã được sử dụng!");

    // Mã hóa mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(matKhau, 10);

    // Tạo người dùng mới
    const nguoiDungMoi = new NguoiDung({ 
      hoTen, 
      email, 
      matKhau: hashedPassword, 
      role, 
      ngaySinh, 
      gioiTinh, 
      soDienThoai 
    });

    await nguoiDungMoi.save();
    return nguoiDungMoi;
  }

  async dangNhap(email, matKhau) {
    const nguoiDung = await NguoiDung.findOne({ email });

    if (!nguoiDung) throw new Error("Email hoặc mật khẩu không đúng!");

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(matKhau, nguoiDung.matKhau);
    if (!isMatch) throw new Error("Email hoặc mật khẩu không đúng!");

    // Tạo JWT token
    const token = jwt.sign(
      { id: nguoiDung._id, role: nguoiDung.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { token, nguoiDung };
  }
}

module.exports = new AuthRepository();
