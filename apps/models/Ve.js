const mongoose = require("mongoose");

const VeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    phimId: { type: mongoose.Schema.Types.ObjectId, ref: "Phim", required: true },
    rapId: { type: mongoose.Schema.Types.ObjectId, ref: "Rap", required: true },
    phongId: { type: mongoose.Schema.Types.ObjectId, ref: "Phong", required: true },
    suatChieuId: { type: mongoose.Schema.Types.ObjectId, ref: "SuatChieu", required: true },
    danhSachGhe: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ghe", required: true }],
    orderId: { type: String, required: true, unique: true },
    totalPrice: { type: Number, required: true },
    trangThai: { type: String, enum: ["Đang xử lý", "Đã thanh toán", "Hủy"], default: "Đang xử lý" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Ve", VeSchema);
