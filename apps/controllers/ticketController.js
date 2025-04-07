const Ve = require('../models/Ve');

exports.renderDoanhThuView = async (req, res) => {
    try {
        // Tổng doanh thu
        const totalRevenueData = await Ve.aggregate([
            { $match: { trangThai: 'Đã thanh toán' } },
            { 
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalPrice' },
                    totalTicketsSold: { $sum: 1 }
                }
            }
        ]);
        const totalRevenue = totalRevenueData[0] || { totalRevenue: 0, totalTicketsSold: 0 };

        // Doanh thu theo ngày
        const revenueByDay = await Ve.aggregate([
            { $match: { trangThai: 'Đã thanh toán' } },
            {
                $group: {
                    _id: {
                        day: { $dayOfMonth: '$createdAt' },
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    totalRevenue: { $sum: '$totalPrice' },
                    totalTicketsSold: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } }
        ]);

        // Doanh thu theo phim
        const revenueByMovie = await Ve.aggregate([
            { $match: { trangThai: 'Đã thanh toán' } },
            {
                $group: {
                    _id: '$phimId',
                    totalRevenue: { $sum: '$totalPrice' },
                    totalTicketsSold: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'phims',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'movie'
                }
            },
            { $unwind: '$movie' },
            {
                $project: {
                    _id: 0,
                    movieName: '$movie.tenPhim',
                    totalRevenue: 1,
                    totalTicketsSold: 1
                }
            }
        ]);

        // Render view với các dữ liệu thống kê
        res.render('revenue', { totalRevenue, revenueByDay, revenueByMovie });
    } catch (error) {
        res.status(500).json({ message: 'Error while fetching revenue data', error });
    }
};
