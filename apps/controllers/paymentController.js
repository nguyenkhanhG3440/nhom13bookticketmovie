const axios = require("axios");
const crypto = require("crypto");
const Ve = require("../models/Ve");
const Ghe = require('../models/Ghe');
const Phim = require('../models/Phim');
const Rap = require('../models/Rap');
const PhongChieu = require('../models/PhongChieu');
const SuatChieu = require('../models/SuatChieu');
const ChiTietPhongChieu = require('../models/ChiTietPhongChieu');
require("dotenv").config();

exports.createMomoPayment = async (req, res) => {
    try {
        const { phimId, rapId, phongId, suatChieuId, danhSachGhe, totalPrice } = req.body;

        const extraData = JSON.stringify({ danhSachGhe, phimId, rapId, phongId, suatChieuId });

        const amount = Number(totalPrice);
        if (isNaN(amount) || amount < 1000 || amount > 50000000) {
            return res.status(400).json({ message: "Số tiền phải từ 1,000 VND đến 50,000,000 VND." });
        }

        const partnerCode = process.env.MOMO_PARTNER_CODE;
        const accessKey = process.env.MOMO_ACCESS_KEY;
        const secretKey = process.env.MOMO_SECRET_KEY;
        const momoApiUrl = process.env.MOMO_API_URL;
        const redirectUrl = process.env.MOMO_REDIRECT_URL;
        const ipnUrl = process.env.MOMO_IPN_URL;
        const requestType = process.env.MOMO_REQUEST_TYPE;

        const requestId = `ORDER_${Date.now()}`;
        const orderId = `ORDER_${Date.now()}`;
        const orderInfo = "Thanh toán đặt vé xem phim";

        const rawData = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
        const signature = crypto.createHmac("sha256", secretKey).update(rawData).digest("hex");

        const requestBody = {
            partnerCode,
            accessKey,
            requestId,
            amount,
            orderId,
            orderInfo,
            redirectUrl,
            ipnUrl,
            requestType,
            extraData,
            signature,
            lang: "vi"
        };

        const response = await axios.post(momoApiUrl, requestBody);
        if (response.data && response.data.payUrl) {
            console.log("🔗 Redirecting to MoMo payment URL:", response.data.payUrl);
            res.redirect(response.data.payUrl);
        } else {
            console.error("❌ Lỗi từ MoMo API:", response.data);
            res.status(400).json({ message: "Lỗi tạo thanh toán với MoMo!", details: response.data });
        }
    } catch (error) {
        console.error("🚨 Lỗi thanh toán MoMo:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: "Lỗi máy chủ khi tạo thanh toán với MoMo!", error: error.message });
    }
};

exports.handlePaymentSuccess = async (req, res) => {
    try {
        const { orderId, amount, resultCode, message, partnerCode, transId, extraData } = req.query;
        console.log("Dữ liệu từ MoMo:", req.query);

        if (!req.session.user || !req.session.user.id) {
            console.error("Không tìm thấy userId trong session. Người dùng chưa đăng nhập?");
            return res.status(401).send('Bạn cần đăng nhập để thực hiện thanh toán.');
        }
        const userId = req.session.user.id;
        console.log("userId từ session:", userId);

        let parsedExtraData;
        try {
            parsedExtraData = JSON.parse(extraData);
            console.log("parsedExtraData:", parsedExtraData);
        } catch (error) {
            console.error('Lỗi parse extraData:', error);
            return res.status(400).send('Dữ liệu thanh toán không hợp lệ.');
        }

        const { danhSachGhe: danhSachGheString, phimId, rapId, phongId, suatChieuId } = parsedExtraData;

        let danhSachGhe;
        try {
            danhSachGhe = JSON.parse(danhSachGheString);
            console.log("danhSachGhe sau khi parse:", danhSachGhe);
        } catch (error) {
            console.error('Lỗi parse danhSachGhe:', error);
            return res.status(400).send('Dữ liệu ghế không hợp lệ.');
        }

        if (!danhSachGhe || !Array.isArray(danhSachGhe) || danhSachGhe.length === 0) {
            console.error("Dữ liệu danhSachGhe không hợp lệ:", danhSachGhe);
            return res.status(400).send('Dữ liệu ghế không hợp lệ.');
        }

        console.log("Dữ liệu trích xuất:", { danhSachGhe, phimId, rapId, phongId, suatChieuId });

        if (resultCode === '0') {
            let totalPrice = Number(amount);

            const updateResult = await ChiTietPhongChieu.updateMany(
                {
                    phong: phongId,
                    ghe: { $in: danhSachGhe }
                },
                { $set: { trangThai: "Đã đặt" } }
            );
            console.log("Kết quả cập nhật trạng thái ghế:", updateResult);

            const ve = new Ve({
                userId,
                phimId,
                rapId,
                phongId,
                suatChieuId,
                danhSachGhe,
                orderId,
                totalPrice,
                trangThai: "Đã thanh toán"
            });

            const savedVe = await ve.save();
            console.log("Dữ liệu đã lưu vào CSDL:", {
                _id: savedVe._id,
                userId: savedVe.userId,
                phimId: savedVe.phimId,
                rapId: savedVe.rapId,
                phongId: savedVe.phongId,
                suatChieuId: savedVe.suatChieuId,
                danhSachGhe: savedVe.danhSachGhe,
                orderId: savedVe.orderId,
                totalPrice: savedVe.totalPrice,
                trangThai: savedVe.trangThai,
                createdAt: savedVe.createdAt
            });

            res.render('payment-success', { message: 'Thanh toán thành công!', orderId });
        } else {
            res.render('payment-fail', { message: 'Thanh toán thất bại. Vui lòng thử lại.' });
        }
    } catch (err) {
        console.error('Lỗi thanh toán:', err);
        res.status(500).send('Có lỗi xảy ra khi xử lý thanh toán');
    }
};