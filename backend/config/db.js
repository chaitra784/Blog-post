const mysql = require("mysql2");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "blog_platform",
    waitForConnections: true,
    connectionLimit: 10
});

db.getConnection((err, connection) => {
    if (err) {
        console.log("❌ Database connection failed:", err.message);
    } else {
        console.log("✅ MySQL database connected successfully");
        connection.release();
    }
});

module.exports = db;