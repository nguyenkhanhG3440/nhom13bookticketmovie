const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const DatabaseConnection = require('./apps/database/database');

dotenv.config();
DatabaseConnection.connect();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình session
app.use(session({
  secret: process.env.JWT_SECRET || 'mySecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Nếu chạy HTTPS, đổi thành true
}));

// Cấu hình cookie-parser
app.use(cookieParser());

// Cấu hình view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/apps/views');

// Cho phép truy cập thư mục public (ảnh, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Import Routes
app.use('/auth', require('./apps/routes/authRoutes'));
app.use('/home', require('./apps/routes/homeRoutes'));

// Import routes
const profileRoutes = require('./apps/routes/profileRoutes');
app.use('/profile', profileRoutes);

const seatRoutes = require('./apps/routes/seatRoutes');
app.use('/seats', seatRoutes);

const theaterRoutes = require('./apps/routes/theaterRoutes');
app.use('/theaters', theaterRoutes);

const showtimeRoutes = require('./apps/routes/showtimeRoutes');
app.use('/showtimes', showtimeRoutes); 

const roomRoutes = require('./apps/routes/roomRoutes');
app.use('/rooms', roomRoutes);

const seatByRoomRoutes = require('./apps/routes/seatByRoomRoutes');
app.use('/seatbyrooms', seatByRoomRoutes);

const paymentRoutes = require("./apps/routes/paymentRoutes");
app.use("/payment", paymentRoutes);

const adminRoutes = require('./apps/routes/adminRoute');
app.use('/admin', adminRoutes);

const ticketRoutes = require('./apps/routes/ticketRoutes');
app.use('/thongke', ticketRoutes);

// Middleware: Truyền user vào tất cả các views
app.use((req, res, next) => {
  console.log("Session User: ", req.session.user)
  res.locals.user = req.session.user || null;
  next();
});

app.use('/selectedseatbyroom', require('./apps/routes/selectedSeatByRoomRoutes'));

// Route của bạn
app.get('/movie/:id', (req, res) => {
  const movie = { /* dữ liệu phim của bạn */ };
  res.render('movie-details', { movie });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server chạy trên http://localhost:${PORT}`));
