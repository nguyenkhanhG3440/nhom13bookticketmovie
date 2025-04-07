const Ghe = require('../models/Ghe');

const seatRepository = {
  getAllSeats: async () => {
    return await Ghe.find();
  },

  getSeatsByPhong: async (phongId) => {
    return await Ghe.find({ phong: phongId });
  },

  getSeatById: async (id) => {
    return await Ghe.findById(id);
  },

  createSeat: async (data) => {
    const ghe = new Ghe(data);
    return await ghe.save();
  },

  updateSeat: async (id, data) => {
    return await Ghe.findByIdAndUpdate(id, data, { new: true });
  },

  deleteSeat: async (id) => {
    return await Ghe.findByIdAndDelete(id);
  }
};

module.exports = seatRepository;
