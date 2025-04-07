const request = require('supertest');
const app = require('../app');
const User = require('../models/user');

describe('Đăng ký tài khoản', () => {
    beforeEach(async () => {
        // Xóa tất cả user trước mỗi test
        await User.deleteMany({});
    });

    // Test case 1: Đăng ký thành công với thông tin hợp lệ
    test('Đăng ký thành công với thông tin hợp lệ', async () => {
        const userData = {
            hoTen: 'Nguyen Van A',
            email: 'test@example.com',
            matKhau: 'Test@123',
            xacNhanMatKhau: 'Test@123',
            soDienThoai: '0123456789',
            ngaySinh: '2000-01-01',
            gioiTinh: 'Nam'
        };

        const response = await request(app)
            .post('/auth/dangky')
            .send(userData);

        expect(response.statusCode).toBe(302); // Redirect sau khi đăng ký thành công
        expect(response.header.location).toBe('/auth/dangnhap');

        // Kiểm tra user đã được tạo trong database
        const user = await User.findOne({ email: userData.email });
        expect(user).toBeTruthy();
        expect(user.hoTen).toBe(userData.hoTen);
        expect(user.soDienThoai).toBe(userData.soDienThoai);
    });

    // Test case 2: Đăng ký thất bại do email đã tồn tại
    test('Đăng ký thất bại do email đã tồn tại', async () => {
        // Tạo user trước
        await User.create({
            hoTen: 'Existing User',
            email: 'existing@example.com',
            matKhau: 'Test@123',
            soDienThoai: '0987654321',
            ngaySinh: '1999-01-01',
            gioiTinh: 'Nam'
        });

        const userData = {
            hoTen: 'New User',
            email: 'existing@example.com', // Email đã tồn tại
            matKhau: 'Test@123',
            xacNhanMatKhau: 'Test@123',
            soDienThoai: '0123456789',
            ngaySinh: '2000-01-01',
            gioiTinh: 'Nam'
        };

        const response = await request(app)
            .post('/auth/dangky')
            .send(userData);

        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('Email đã tồn tại');
    });

    // Test case 3: Đăng ký thất bại do mật khẩu không đủ mạnh
    test('Đăng ký thất bại do mật khẩu không đủ mạnh', async () => {
        const userData = {
            hoTen: 'Test User',
            email: 'test2@example.com',
            matKhau: 'weak', // Mật khẩu yếu
            xacNhanMatKhau: 'weak',
            soDienThoai: '0123456789',
            ngaySinh: '2000-01-01',
            gioiTinh: 'Nam'
        };

        const response = await request(app)
            .post('/auth/dangky')
            .send(userData);

        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('Mật khẩu phải dài ít nhất 6 ký tự');
    });

    // Test case 4: Đăng ký thất bại do số điện thoại không hợp lệ
    test('Đăng ký thất bại do số điện thoại không hợp lệ', async () => {
        const userData = {
            hoTen: 'Test User',
            email: 'test3@example.com',
            matKhau: 'Test@123',
            xacNhanMatKhau: 'Test@123',
            soDienThoai: '123', // Số điện thoại không hợp lệ
            ngaySinh: '2000-01-01',
            gioiTinh: 'Nam'
        };

        const response = await request(app)
            .post('/auth/dangky')
            .send(userData);

        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('Số điện thoại phải có đúng 10 chữ số');
    });

    // Test case 5: Đăng ký thất bại do mật khẩu và xác nhận mật khẩu không khớp
    test('Đăng ký thất bại do mật khẩu và xác nhận mật khẩu không khớp', async () => {
        const userData = {
            hoTen: 'Test User',
            email: 'test4@example.com',
            matKhau: 'Test@123',
            xacNhanMatKhau: 'Different@123', // Mật khẩu xác nhận khác
            soDienThoai: '0123456789',
            ngaySinh: '2000-01-01',
            gioiTinh: 'Nam'
        };

        const response = await request(app)
            .post('/auth/dangky')
            .send(userData);

        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('Mật khẩu và xác nhận mật khẩu không khớp');
    });

    // Test case 6: Đăng ký thất bại do thiếu thông tin bắt buộc
    test('Đăng ký thất bại do thiếu thông tin bắt buộc', async () => {
        const userData = {
            // Thiếu email
            hoTen: 'Test User',
            matKhau: 'Test@123',
            xacNhanMatKhau: 'Test@123',
            soDienThoai: '0123456789',
            ngaySinh: '2000-01-01',
            gioiTinh: 'Nam'
        };

        const response = await request(app)
            .post('/auth/dangky')
            .send(userData);

        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('Vui lòng điền đầy đủ thông tin');
    });
}); 