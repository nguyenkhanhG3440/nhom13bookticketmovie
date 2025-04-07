const Phim = require('../models/Phim');

exports.trangChu = async (req, res) => {
    try {
      const movies = await Phim.find().sort({ createdAt: -1 }).limit(12);
  
      const success = req.session.success;
      req.session.success = null; // Xoá để không hiện lại lần sau
  
      res.render('home', {
        user: req.session.user,
        movies,
        success
      });
    } catch (error) {
      console.error("❌ Lỗi lấy phim:", error);
      res.render('home', {
        user: req.session.user,
        movies: [],
        success: null
      });
    }
  };
  

