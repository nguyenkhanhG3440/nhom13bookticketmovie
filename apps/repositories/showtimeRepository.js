// repositories/showtimeRepository.js
const SuatChieu = require('../models/SuatChieu');

exports.getAllShowtimes = async () => {
  return await SuatChieu.find().sort({ ngayGioBatDau: 1 });
};

exports.createShowtime = async (data) => {
  const showtime = new SuatChieu(data);
  return await showtime.save();
};
