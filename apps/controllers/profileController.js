const multer = require('multer');
const fs = require('fs');
const path = require('path');
const NguoiDung = require('../models/NguoiDung');

// 📌 Tạo thư mục lưu ảnh nếu chưa tồn tại
const avatarDir = 'public/images/avatar';
if (!fs.existsSync(avatarDir)) {
    fs.mkdirSync(avatarDir, { recursive: true });
}

// Cấu hình Multer để lưu ảnh vào thư mục "public/images/avatar"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, avatarDir);
    },
    filename: function (req, file, cb) {
        cb(null, req.session.user.id + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

exports.hienThiHoSo = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/dangnhap'); // Nếu chưa đăng nhập, chuyển về đăng nhập
    }

    try {
        const nguoiDung = await NguoiDung.findById(req.session.user.id);
        if (!nguoiDung) {
            return res.redirect('/auth/dangnhap');
        }

        res.render('profile', { user: nguoiDung });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
};

exports.capNhatHoSo = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/dangnhap');
    }

    try {
        const { hoTen, soDienThoai, gioiTinh, ngaySinh } = req.body;
        let avatarPath = req.session.user.avatar;

        // Nếu có upload ảnh, cập nhật đường dẫn ảnh mới
        if (req.file) {
            avatarPath = '/images/avatar/' + req.file.filename;
        }

        const updatedUser = await NguoiDung.findByIdAndUpdate(
            req.session.user.id,
            { hoTen, soDienThoai, gioiTinh, ngaySinh: new Date(ngaySinh), avatar: avatarPath },
            { new: true }
        );

        req.session.user = {
            id: updatedUser._id,
            hoTen: updatedUser.hoTen,
            soDienThoai: updatedUser.soDienThoai,
            gioiTinh: updatedUser.gioiTinh,
            ngaySinh: updatedUser.ngaySinh,
            avatar: updatedUser.avatar
        };

        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        res.redirect('/profile');
    }
};

// Export middleware upload ảnh
exports.uploadAvatar = upload.single('avatar');
