const mongoose = require('mongoose');
require('dotenv').config();

class DatabaseConnection {
    static instance = null;

    static async connect() {
        if (!this.instance) {
            try {
                const mongoURI = process.env.MONGO_URI;
                this.instance = await mongoose.connect(mongoURI, {}); // Xóa các option không cần thiết
                console.log("✅ Kết nối MongoDB thành công!");
            } catch (error) {
                console.error("❌ Lỗi kết nối MongoDB:", error);
                process.exit(1);
            }
        }
        return this.instance;
    }
}

module.exports = DatabaseConnection;
