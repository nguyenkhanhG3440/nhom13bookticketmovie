const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Phim = require('../models/Phim'); // Đường dẫn đến model Phim
const { processTrailer } = require('../utils/trailerProcessor'); // Đường dẫn đến trailerProcessor
const fs = require('fs');

// Middleware kiểm tra quyền admin
const isAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).send('Bạn không có quyền truy cập trang này.');
    }
    next();
};

// Cấu hình multer để lưu file upload
const storage = multer.diskStorage({
    destination: './public/images/movies/', // Lưu vào public/images/movies
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|mp4/; // Chấp nhận cả ảnh (jpeg, jpg, png) và video (mp4)
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = file.mimetype === 'video/mp4' || /image\/(jpeg|jpg|png)/.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file JPEG, JPG, PNG hoặc MP4!'));
        }
    }
});

// Đảm bảo thư mục public/images/movies tồn tại
if (!fs.existsSync('./public/images/movies')) {
    fs.mkdirSync('./public/images/movies', { recursive: true });
}

// Route hiển thị form thêm phim
router.get('/phim/add', isAdmin, (req, res) => {
    res.render('admin/add-phim');
});

// Route xử lý thêm phim
router.post('/phim/add', isAdmin, upload.fields([
    { name: 'poster', maxCount: 1 }, // Upload file poster
    { name: 'trailer', maxCount: 1 } // Upload file trailer
]), async (req, res) => {
    try {
        const {
            title,
            theLoai,
            ngayKhoiChieu,
            thoiLuong,
            daoDien,
            dienVien,
            isHot,
            gia
        } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!title || !thoiLuong || !gia) {
            return res.status(400).json({ message: 'Thiếu các trường bắt buộc: title, thoiLuong, gia' });
        }

        // Kiểm tra file poster và trailer
        if (!req.files['poster'] || !req.files['trailer']) {
            return res.status(400).json({ message: 'Vui lòng upload file poster (JPEG/JPG/PNG) và trailer (MP4)' });
        }

        const posterPath = `/images/movies/${req.files['poster'][0].filename}`; // Đường dẫn tương đối
        const trailerPath = req.files['trailer'][0].path; // Đường dẫn tuyệt đối để xử lý trailer
        const trailerUrl = `/images/movies/${req.files['trailer'][0].filename}`; // Đường dẫn tương đối

        // Tạo mô tả từ trailer
        const description = await processTrailer(trailerPath);

        // Tạo phim mới
        const phim = new Phim({
            title,
            posterUrl: posterPath, // Lưu đường dẫn tương đối
            description,
            theLoai,
            ngayKhoiChieu: ngayKhoiChieu ? new Date(ngayKhoiChieu) : undefined,
            thoiLuong: Number(thoiLuong),
            daoDien,
            dienVien: dienVien ? dienVien.split(',').map(item => item.trim()) : [],
            trailerUrl: trailerUrl, // Lưu đường dẫn tương đối
            isHot: isHot === 'true',
            gia: Number(gia)
        });

        // Lưu phim vào CSDL
        const savedPhim = await phim.save();

        res.redirect('/home?success=Thêm phim thành công!');
    } catch (error) {
        console.error('Lỗi khi thêm phim:', error);
        res.status(500).json({ message: 'Lỗi khi thêm phim: ' + error.message });
    }
});

// Route hiển thị danh sách phim
router.get('/phim/list', isAdmin, async (req, res) => {
    try {
        const movies = await Phim.find();
        res.render('/home', { movies });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách phim:', error);
        res.status(500).send('Lỗi server');
    }
});

// Route hiển thị form chỉnh sửa phim
router.get('/phim/edit/:id', isAdmin, async (req, res) => {
    try {
        const phim = await Phim.findById(req.params.id);
        if (!phim) {
            return res.status(404).send('Phim không tồn tại');
        }
        res.render('admin/edit-phim', { phim });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin phim:', error);
        res.status(500).send('Lỗi server');
    }
});

// Route xử lý chỉnh sửa phim
router.post('/phim/edit/:id', isAdmin, upload.fields([
    { name: 'poster', maxCount: 1 },
    { name: 'trailer', maxCount: 1 }
]), async (req, res) => {
    try {
        const {
            title,
            theLoai,
            ngayKhoiChieu,
            thoiLuong,
            daoDien,
            dienVien,
            isHot,
            gia
        } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!title || !thoiLuong || !gia) {
            return res.status(400).json({ message: 'Thiếu các trường bắt buộc: title, thoiLuong, gia' });
        }

        const phim = await Phim.findById(req.params.id);
        if (!phim) {
            return res.status(404).send('Phim không tồn tại');
        }

        // Xử lý file poster mới (nếu có)
        let posterUrl = phim.posterUrl;
        if (req.files['poster']) {
            // Xóa file poster cũ (nếu có)
            if (phim.posterUrl && fs.existsSync(`./public${phim.posterUrl}`)) {
                fs.unlinkSync(`./public${phim.posterUrl}`);
            }
            posterUrl = `/images/movies/${req.files['poster'][0].filename}`;
        }

        // Xử lý file trailer mới (nếu có)
        let description = phim.description;
        let trailerUrl = phim.trailerUrl;
        if (req.files['trailer']) {
            const trailerPath = req.files['trailer'][0].path;
            description = await processTrailer(trailerPath);
            trailerUrl = `/images/movies/${req.files['trailer'][0].filename}`;

            // Xóa file trailer cũ (nếu có)
            if (phim.trailerUrl && fs.existsSync(`./public${phim.trailerUrl}`)) {
                fs.unlinkSync(`./public${phim.trailerUrl}`);
            }
        }

        // Cập nhật thông tin phim
        phim.title = title;
        phim.posterUrl = posterUrl;
        phim.description = description;
        phim.theLoai = theLoai;
        phim.ngayKhoiChieu = ngayKhoiChieu ? new Date(ngayKhoiChieu) : undefined;
        phim.thoiLuong = Number(thoiLuong);
        phim.daoDien = daoDien;
        phim.dienVien = dienVien ? dienVien.split(',').map(item => item.trim()) : [];
        phim.trailerUrl = trailerUrl;
        phim.isHot = isHot === 'true';
        phim.gia = Number(gia);

        // Lưu phim đã chỉnh sửa
        await phim.save();

        res.redirect('/home?success=Chỉnh sửa phim thành công!');
    } catch (error) {
        console.error('Lỗi khi chỉnh sửa phim:', error);
        res.status(500).json({ message: 'Lỗi khi chỉnh sửa phim: ' + error.message });
    }
});

// Route xóa phim
router.delete('/phim/delete/:id', isAdmin, async (req, res) => {
    try {
        const phim = await Phim.findById(req.params.id);
        if (!phim) {
            return res.status(404).json({ message: 'Phim không tồn tại' });
        }

        // Xóa file poster và trailer (nếu có)
        if (phim.posterUrl && fs.existsSync(`./public${phim.posterUrl}`)) {
            fs.unlinkSync(`./public${phim.posterUrl}`);
        }
        if (phim.trailerUrl && fs.existsSync(`./public${phim.trailerUrl}`)) {
            fs.unlinkSync(`./public${phim.trailerUrl}`);
        }

        // Xóa phim khỏi CSDL
        await Phim.findByIdAndDelete(req.params.id);

        res.json({ message: 'Xóa phim thành công!' });
    } catch (error) {
        console.error('Lỗi khi xóa phim:', error);
        res.status(500).json({ message: 'Lỗi khi xóa phim: ' + error.message });
    }
});

module.exports = router;