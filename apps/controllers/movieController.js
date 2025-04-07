const Phim = require('../models/Phim');
const ChiTietThongTinPhim = require('../models/ChiTietThongTinPhim');
const Rap = require('../models/Rap');
const SuatChieu = require('../models/SuatChieu');
const PhongChieu = require('../models/PhongChieu');
const Ghe = require('../models/Ghe');
const ChiTietPhongChieu = require('../models/ChiTietPhongChieu');

exports.getMovieDetails = async (req, res) => {
    try {
        const movie = await Phim.findById(req.params.movieId);
        if (!movie) return res.status(404).send('Phim không tồn tại');
        res.render('movie-details', { movie, user: req.session.user || null });
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi khi tìm phim');
    }
};

exports.getSelectedMovieTheaterRoom = async (req, res) => {
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
};

exports.getSelectedSeat = async (req, res) => {
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
};

exports.confirmBooking = async (req, res) => {
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

        let totalSeatPrice = gheDaChon.reduce((sum, ghe) => sum + (ghe.type === 'VIP' ? 800 : 500), 0);
        const totalPrice = phim.gia + totalSeatPrice;

        console.log("💰 Tổng tiền:", totalPrice);

        res.render('confirm-booking', {
            phim, rap, phong, suatChieu, gheDaChon, totalSeatPrice, totalPrice, user: req.session.user
        });
    } catch (error) {
        console.error('🔥 Lỗi xác nhận vé:', error);
        res.status(500).send('Lỗi khi hiển thị thông tin vé.');
    }
};