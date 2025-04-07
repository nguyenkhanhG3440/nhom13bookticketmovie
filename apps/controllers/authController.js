const authRepository = require('../repositories/authRepository');

exports.dangKy = async (req, res) => {
    try {
        const nguoiDungMoi = await authRepository.dangKy(req.body);
        req.session.message = "Đăng ký thành công! Hãy đăng nhập.";
        res.redirect('/auth/dangnhap');
    } catch (error) {
        req.session.message = error.message;
        res.redirect('/auth/dangky');
    }
};

exports.dangNhap = async (req, res) => {
  try {
      const { token, nguoiDung } = await authRepository.dangNhap(req.body.email, req.body.matKhau);

      // Lưu token vào session
      req.session.token = token;
      req.session.user = {
          id: nguoiDung._id,
          hoTen: nguoiDung.hoTen,
          email: nguoiDung.email,
          role: nguoiDung.role,
          ngaySinh: nguoiDung.ngaySinh,
          gioiTinh: nguoiDung.gioiTinh,
          soDienThoai: nguoiDung.soDienThoai,
          avatar: nguoiDung.avatar || 'public/images/default-avatar.png'
      };

      // Lưu token vào cookie (expires in 1 day)
      res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

      req.session.success = "Đăng nhập thành công!";
res.redirect('/home');

  } catch (error) {
      req.session.message = error.message;
      res.redirect('/auth/dangnhap');
  }
};


exports.dangXuat = (req, res) => {
  req.session.destroy(); // Xóa session
  res.clearCookie('token'); // Xóa cookie
  res.redirect('/auth/dangnhap'); // Quay về trang đăng nhập
};
