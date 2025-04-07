/*const express = require('express');
const router = express.Router();
const Phim = require('../models/Phim');
const homeController = require('../controllers/homeController');
const ChiTietThongTinPhim = require('../models/ChiTietThongTinPhim');
const Rap = require('../models/Rap');
const SuatChieu = require('../models/SuatChieu');
const PhongChieu = require('../models/PhongChieu');
const Ghe = require('../models/Ghe');
const Ve = require("../models/Ve");
const ChiTietPhongChieu = require('../models/ChiTietPhongChieu');
const axios = require('axios');
const crypto = require("crypto");
require("dotenv").config();


// Home Route
router.get('/', homeController.trangChu);

// Chi tiết phim
router.get('/movie-details/:movieId', async (req, res) => {
    try {
        const movie = await Phim.findById(req.params.movieId);
        if (!movie) return res.status(404).send('Phim không tồn tại');
        res.render('movie-details', { movie, user: req.session.user || null });
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi khi tìm phim');
    }
});

// Chọn rạp, phòng, suất chiếu
router.get('/selected-movie-theater-room/:movieId', async (req, res) => {
    if (!req.session.user) return res.redirect('/auth/dangnhap');

    try {
        const movie = await Phim.findById(req.params.movieId);
        if (!movie) return res.status(404).send('Phim không tồn tại');

        const selectedMovieTheaterRoom = await ChiTietThongTinPhim.find({ phim: movie._id })
            .populate('rap phong suatChieu');

        res.render('selected-movie-theater-room', {
            movie,
            selectedMovieTheaterRoom,
            user: req.session.user
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi khi tìm phim');
    }
});

// Chọn ghế
router.get('/selected-seat/:phongId', async (req, res) => {
    try {
        const phong = await PhongChieu.findById(req.params.phongId);
        const danhSachGhe = await ChiTietPhongChieu.find({ phong: phong._id }).populate('ghe');

        const chiTiet = await ChiTietThongTinPhim.findOne({ phong: phong._id })
            .populate('phim rap suatChieu');

        if (!phong || !chiTiet) return res.status(404).send('Không tìm thấy dữ liệu');

        res.render('selected-seat', {
            phong,
            danhSachGhe,
            movie: chiTiet.phim,
            rap: chiTiet.rap,
            suatChieu: chiTiet.suatChieu,
            user: req.session.user
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi khi lấy danh sách ghế');
    }
});

router.post('/confirm-booking', async (req, res) => {
    const { phimId, rapId, phongId, suatChieuId, danhSachGhe } = req.body;

    try {
        const [phim, rap, phong, suatChieu, gheDaChon] = await Promise.all([
            Phim.findById(phimId),
            Rap.findById(rapId),
            PhongChieu.findById(phongId),
            SuatChieu.findById(suatChieuId),
            Ghe.find({ _id: { $in: JSON.parse(danhSachGhe) } })
        ]);

        if (!phim || !rap || !phong || !suatChieu || !gheDaChon.length) {
            return res.status(400).send('Dữ liệu không hợp lệ!');
        }

        // 🔥 Tính tổng tiền
        let totalSeatPrice = gheDaChon.reduce((sum, ghe) => sum + (ghe.type === 'VIP' ? 800 : 500), 0);
        const totalPrice = phim.gia + totalSeatPrice;

        console.log("💰 Tổng tiền:", totalPrice);

        // 🟢 Render EJS với totalPrice
        res.render('confirm-booking', {
            phim, rap, phong, suatChieu, gheDaChon, totalSeatPrice, totalPrice, user: req.session.user
        });

    } catch (error) {
        console.error('🔥 Lỗi xác nhận vé:', error);
        res.status(500).send('Lỗi khi hiển thị thông tin vé.');
    }
});

module.exports = router;
*/

const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const movieController = require('../controllers/movieController');
require("dotenv").config();

// Home Route
router.get('/', homeController.trangChu);

// Chi tiết phim
router.get('/movie-details/:movieId', movieController.getMovieDetails);

// Chọn rạp, phòng, suất chiếu
router.get('/selected-movie-theater-room/:movieId', movieController.getSelectedMovieTheaterRoom);

// Chọn ghế
router.get('/selected-seat/:phongId', movieController.getSelectedSeat);

// Xác nhận đặt vé
router.post('/confirm-booking', movieController.confirmBooking);

module.exports = router;