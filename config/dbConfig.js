const mysql = require("mysql2");
const config = require("./config");

// Create connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: config.db_host,
  user: config.db_user,
  password: config.db_password,
  database: config.db_name,
});

module.exports = pool;
