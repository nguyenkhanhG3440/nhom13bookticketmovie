const Rap = require('../models/Rap');

const theaterRepository = {
  getAllTheaters: async () => {
    return await Rap.find(); // Lấy tất cả rạp
  },
  getTheaterById: async (id) => {
    return await Rap.findById(id);
  }
};

module.exports = theaterRepository;
