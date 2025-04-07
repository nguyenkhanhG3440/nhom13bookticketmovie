const theaterRepo = require('../repositories/theaterRepository');

exports.getAllTheaters = async (req, res) => {
    try {
        const theaters = await theaterRepo.getAllTheaters();
        res.render('theater/theater', {
            theaters,
            user: req.session.user || null
        });
    } catch (err) {
        console.error('Lỗi khi lấy danh sách rạp:', err);
        res.status(500).send('Lỗi khi lấy danh sách rạp');
    }
};
