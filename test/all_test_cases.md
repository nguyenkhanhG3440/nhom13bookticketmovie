# Test Cases for Movie Ticket Booking System

## Module 1: Authentication

| STT | Testcase ID | Sub-Module | Testcase Summary | Priority | Pre-condition | Pre-steps | Step by step | Expected Result | Actual Result | Test Result | Note |
|-----|------------|------------|------------------|----------|---------------|-----------|--------------|-----------------|---------------|-------------|------|
| 1 | TC_AUTH_001 | Đăng ký | Đăng ký thành công với thông tin hợp lệ | High | - Chưa đăng nhập | 1. Truy cập trang /auth/dangky | 1. Nhập thông tin:<br>- Họ tên: Nguyễn Văn A<br>- Email: test@example.com<br>- Mật khẩu: Test@123<br>- Xác nhận mật khẩu: Test@123<br>- Số điện thoại: 0123456789<br>- Ngày sinh: 01/01/2000<br>- Giới tính: Nam<br>2. Click nút "Đăng Ký" | 1. Hiển thị thông báo "Đăng ký thành công"<br>2. Redirect về trang đăng nhập | | | |
| 2 | TC_AUTH_002 | Đăng ký | Đăng ký thất bại do email đã tồn tại | High | - Email test@example.com đã tồn tại | 1. Truy cập trang /auth/dangky | 1. Nhập thông tin với email test@example.com<br>2. Click nút "Đăng Ký" | 1. Hiển thị thông báo "Email đã tồn tại"<br>2. Vẫn ở lại trang đăng ký | | | |
| 3 | TC_AUTH_003 | Đăng nhập | Đăng nhập thành công | High | - Đã có tài khoản | 1. Truy cập trang /auth/dangnhap | 1. Nhập email và mật khẩu đúng<br>2. Click nút "Đăng nhập" | 1. Hiển thị thông báo "Đăng nhập thành công"<br>2. Redirect về trang chủ<br>3. Hiển thị thông tin người dùng | | | |
| 4 | TC_AUTH_004 | Đăng nhập | Đăng nhập thất bại do sai mật khẩu | High | - Đã có tài khoản | 1. Truy cập trang /auth/dangnhap | 1. Nhập email đúng, mật khẩu sai<br>2. Click nút "Đăng nhập" | 1. Hiển thị thông báo "Email hoặc mật khẩu không đúng"<br>2. Vẫn ở lại trang đăng nhập | | | |
| 5 | TC_AUTH_005 | Đăng xuất | Đăng xuất thành công | High | - Đã đăng nhập | 1. Click vào nút "Đăng xuất" | 1. Xác nhận đăng xuất | 1. Redirect về trang đăng nhập<br>2. Session và cookie bị xóa | | | |

## Module 2: Movie Management

| STT | Testcase ID | Sub-Module | Testcase Summary | Priority | Pre-condition | Pre-steps | Step by step | Expected Result | Actual Result | Test Result | Note |
|-----|------------|------------|------------------|----------|---------------|-----------|--------------|-----------------|---------------|-------------|------|
| 6 | TC_MOVIE_001 | Xem danh sách phim | Xem danh sách phim thành công | High | - Đã đăng nhập | 1. Truy cập trang chủ /home | 1. Chờ trang load xong | 1. Hiển thị danh sách phim<br>2. Mỗi phim hiển thị:<br>- Poster<br>- Tên phim<br>- Thể loại<br>- Thời lượng<br>- Giá vé | | | |
| 7 | TC_MOVIE_002 | Xem chi tiết phim | Xem chi tiết phim thành công | High | - Đã đăng nhập | 1. Click vào một phim trong danh sách | 1. Chờ trang load xong | 1. Hiển thị đầy đủ thông tin phim:<br>- Poster<br>- Tên phim<br>- Đạo diễn<br>- Diễn viên<br>- Thể loại<br>- Thời lượng<br>- Ngày khởi chiếu<br>- Mô tả<br>- Giá vé | | | |
| 8 | TC_MOVIE_003 | Xem chi tiết phim | Xem chi tiết phim không tồn tại | High | - Đã đăng nhập | 1. Truy cập URL /movie-details/123456789 | 1. Chờ trang load xong | 1. Hiển thị thông báo "Phim không tồn tại"<br>2. Redirect về trang chủ | | | |

## Module 3: Booking Process

| STT | Testcase ID | Sub-Module | Testcase Summary | Priority | Pre-condition | Pre-steps | Step by step | Expected Result | Actual Result | Test Result | Note |
|-----|------------|------------|------------------|----------|---------------|-----------|--------------|-----------------|---------------|-------------|------|
| 9 | TC_BOOK_001 | Chọn rạp/phòng/suất chiếu | Chọn thành công | High | - Đã đăng nhập<br>- Đã chọn phim | 1. Click nút "Đặt vé" trên trang chi tiết phim | 1. Chọn rạp<br>2. Chọn phòng<br>3. Chọn suất chiếu | 1. Hiển thị danh sách rạp/phòng/suất chiếu khả dụng<br>2. Có thể chọn tiếp tục | | | |
| 10 | TC_BOOK_002 | Chọn ghế | Chọn ghế thành công | High | - Đã chọn rạp/phòng/suất chiếu | 1. Click vào ghế trống | 1. Chọn số lượng ghế cần đặt | 1. Ghế được đánh dấu đã chọn<br>2. Hiển thị tổng tiền | | | |
| 11 | TC_BOOK_003 | Chọn ghế | Chọn ghế đã được đặt | High | - Đã chọn rạp/phòng/suất chiếu<br>- Ghế đã được đặt | 1. Click vào ghế đã được đặt | 1. Thử chọn ghế | 1. Hiển thị thông báo "Ghế đã được đặt"<br>2. Không thể chọn ghế | | | |
| 12 | TC_BOOK_004 | Xác nhận đặt vé | Xác nhận thành công | High | - Đã chọn ghế | 1. Click nút "Tiếp tục" | 1. Xem lại thông tin đặt vé<br>2. Click nút "Xác nhận" | 1. Hiển thị thông tin đặt vé:<br>- Thông tin phim<br>- Thông tin rạp/phòng<br>- Thông tin ghế<br>- Tổng tiền<br>2. Có nút "Thanh toán" | | | |

## Module 4: Payment Process

| STT | Testcase ID | Sub-Module | Testcase Summary | Priority | Pre-condition | Pre-steps | Step by step | Expected Result | Actual Result | Test Result | Note |
|-----|------------|------------|------------------|----------|---------------|-----------|--------------|-----------------|---------------|-------------|------|
| 13 | TC_PAY_001 | Thanh toán MoMo | Tạo thanh toán thành công | High | - Đã xác nhận đặt vé | 1. Click nút "Thanh toán" | 1. Chọn phương thức MoMo<br>2. Click "Thanh toán" | 1. Redirect đến trang thanh toán MoMo<br>2. Hiển thị thông tin thanh toán | | | |
| 14 | TC_PAY_002 | Thanh toán MoMo | Thanh toán thành công | High | - Đã tạo thanh toán MoMo | 1. Hoàn tất thanh toán trên MoMo | 1. Quay về trang web | 1. Hiển thị trang "Thanh toán thành công"<br>2. Gửi email xác nhận<br>3. Cập nhật trạng thái ghế | | | |
| 15 | TC_PAY_003 | Thanh toán MoMo | Thanh toán thất bại | High | - Đã tạo thanh toán MoMo | 1. Hủy thanh toán trên MoMo | 1. Quay về trang web | 1. Hiển thị trang "Thanh toán thất bại"<br>2. Ghế được giải phóng<br>3. Có nút "Thử lại" | | | |

## Module 5: Profile Management

| STT | Testcase ID | Sub-Module | Testcase Summary | Priority | Pre-condition | Pre-steps | Step by step | Expected Result | Actual Result | Test Result | Note |
|-----|------------|------------|------------------|----------|---------------|-----------|--------------|-----------------|---------------|-------------|------|
| 16 | TC_PROF_001 | Xem thông tin cá nhân | Xem thành công | High | - Đã đăng nhập | 1. Click vào avatar/username | 1. Chọn "Thông tin cá nhân" | 1. Hiển thị thông tin:<br>- Họ tên<br>- Email<br>- Số điện thoại<br>- Ngày sinh<br>- Giới tính | | | |
| 17 | TC_PROF_002 | Cập nhật thông tin | Cập nhật thành công | High | - Đã đăng nhập | 1. Truy cập trang thông tin cá nhân<br>2. Click nút "Chỉnh sửa" | 1. Cập nhật thông tin mới<br>2. Click nút "Lưu" | 1. Hiển thị thông báo "Cập nhật thành công"<br>2. Thông tin được cập nhật | | | |
| 18 | TC_PROF_003 | Xem lịch sử đặt vé | Xem thành công | High | - Đã đăng nhập<br>- Đã có vé đã đặt | 1. Truy cập trang thông tin cá nhân<br>2. Click tab "Lịch sử đặt vé" | 1. Chờ trang load xong | 1. Hiển thị danh sách vé đã đặt:<br>- Tên phim<br>- Rạp<br>- Ngày chiếu<br>- Ghế<br>- Giá vé<br>- Trạng thái | | | |

## Module 6: Admin Functions

| STT | Testcase ID | Sub-Module | Testcase Summary | Priority | Pre-condition | Pre-steps | Step by step | Expected Result | Actual Result | Test Result | Note |
|-----|------------|------------|------------------|----------|---------------|-----------|--------------|-----------------|---------------|-------------|------|
| 19 | TC_ADMIN_001 | Quản lý phim | Thêm phim mới thành công | High | - Đã đăng nhập với quyền admin | 1. Truy cập trang quản lý phim<br>2. Click nút "Thêm phim" | 1. Nhập thông tin phim<br>2. Upload poster<br>3. Click nút "Lưu" | 1. Hiển thị thông báo "Thêm phim thành công"<br>2. Phim xuất hiện trong danh sách | | | |
| 20 | TC_ADMIN_002 | Quản lý phim | Xóa phim thành công | High | - Đã đăng nhập với quyền admin<br>- Phim chưa có suất chiếu | 1. Truy cập trang quản lý phim<br>2. Click nút "Xóa" của một phim | 1. Xác nhận xóa | 1. Hiển thị thông báo "Xóa thành công"<br>2. Phim biến mất khỏi danh sách | | | |
| 21 | TC_ADMIN_003 | Quản lý doanh thu | Xem báo cáo doanh thu | High | - Đã đăng nhập với quyền admin | 1. Truy cập trang quản lý doanh thu | 1. Chọn khoảng thời gian<br>2. Click nút "Xem báo cáo" | 1. Hiển thị biểu đồ doanh thu<br>2. Hiển thị danh sách chi tiết các giao dịch | | | |

## Module 7: Error Handling

| STT | Testcase ID | Sub-Module | Testcase Summary | Priority | Pre-condition | Pre-steps | Step by step | Expected Result | Actual Result | Test Result | Note |
|-----|------------|------------|------------------|----------|---------------|-----------|--------------|-----------------|---------------|-------------|------|
| 22 | TC_ERR_001 | Xử lý lỗi | Truy cập trang không tồn tại | Medium | - Đã đăng nhập | 1. Truy cập URL không tồn tại | 1. Chờ trang load xong | 1. Hiển thị trang 404<br>2. Có nút quay về trang chủ | | | |
| 23 | TC_ERR_002 | Xử lý lỗi | Truy cập trang admin không có quyền | Medium | - Đã đăng nhập với user thường | 1. Truy cập trang quản trị | 1. Chờ trang load xong | 1. Hiển thị thông báo "Không có quyền truy cập"<br>2. Redirect về trang chủ | | | |
| 24 | TC_ERR_003 | Xử lý lỗi | Xử lý lỗi kết nối database | High | - Đã đăng nhập | 1. Database bị ngắt kết nối | 1. Thực hiện thao tác bất kỳ | 1. Hiển thị thông báo lỗi<br>2. Có nút thử lại | | | |

## Module 8: Performance Testing

| STT | Testcase ID | Sub-Module | Testcase Summary | Priority | Pre-condition | Pre-steps | Step by step | Expected Result | Actual Result | Test Result | Note |
|-----|------------|------------|------------------|----------|---------------|-----------|--------------|-----------------|---------------|-------------|------|
| 25 | TC_PERF_001 | Kiểm tra hiệu năng | Load trang chủ với nhiều phim | High | - Đã đăng nhập | 1. Truy cập trang chủ | 1. Đo thời gian load trang | 1. Trang load trong vòng 3 giây<br>2. Hiển thị đầy đủ nội dung | | | |
| 26 | TC_PERF_002 | Kiểm tra hiệu năng | Xử lý đặt vé đồng thời | High | - Đã đăng nhập<br>- Có nhiều người dùng cùng đặt vé | 1. Thực hiện đặt vé cùng lúc | 1. Đo thời gian xử lý<br>2. Kiểm tra tính nhất quán dữ liệu | 1. Hệ thống xử lý được yêu cầu<br>2. Không có xung đột dữ liệu<br>3. Thời gian xử lý < 5 giây | | | |

## Module 9: Theater Management

| STT | Testcase ID | Sub-Module | Testcase Summary | Priority | Pre-condition | Pre-steps | Step by step | Expected Result | Actual Result | Test Result | Note |
|-----|------------|------------|------------------|----------|---------------|-----------|--------------|-----------------|---------------|-------------|------|
| 27 | TC_THEATER_001 | Quản lý rạp | Thêm rạp mới thành công | High | - Đã đăng nhập với quyền admin | 1. Truy cập trang quản lý rạp<br>2. Click nút "Thêm rạp" | 1. Nhập thông tin rạp<br>2. Click nút "Lưu" | 1. Hiển thị thông báo "Thêm rạp thành công"<br>2. Rạp xuất hiện trong danh sách | | | |
| 28 | TC_THEATER_002 | Quản lý rạp | Cập nhật thông tin rạp thành công | High | - Đã đăng nhập với quyền admin<br>- Rạp đã tồn tại | 1. Truy cập trang quản lý rạp<br>2. Click nút "Sửa" của một rạp | 1. Cập nhật thông tin<br>2. Click nút "Lưu" | 1. Hiển thị thông báo "Cập nhật thành công"<br>2. Thông tin rạp được cập nhật | | | |
| 29 | TC_THEATER_003 | Quản lý rạp | Xóa rạp thành công | High | - Đã đăng nhập với quyền admin<br>- Rạp chưa có phòng | 1. Truy cập trang quản lý rạp<br>2. Click nút "Xóa" của một rạp | 1. Xác nhận xóa | 1. Hiển thị thông báo "Xóa thành công"<br>2. Rạp biến mất khỏi danh sách | | | |
| 30 | TC_ROOM_001 | Quản lý phòng | Thêm phòng mới thành công | High | - Đã đăng nhập với quyền admin<br>- Đã chọn rạp | 1. Truy cập trang quản lý phòng<br>2. Click nút "Thêm phòng" | 1. Nhập thông tin phòng<br>2. Click nút "Lưu" | 1. Hiển thị thông báo "Thêm phòng thành công"<br>2. Phòng xuất hiện trong danh sách | | | | 