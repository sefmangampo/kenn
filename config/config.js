require("dotenv");

let CONFIG = {};

CONFIG.port = process.env.PORT || 3000;

CONFIG.db_host = process.env.DB_HOST || "localhost";
CONFIG.db_dialect = process.env.DB_DIALECT || "mysql";
CONFIG.db_port = process.env.DB_PORT || "3306";
CONFIG.db_name = process.env.DB_NAME || "training_db";
CONFIG.db_user = process.env.DB_USER || "root";
CONFIG.db_password = process.env.DB_PASSWORD || "password";

CONFIG.db_charset = "utf8mb4";
CONFIG.db_collation = "utf8mb4_unicode_ci";

module.exports = CONFIG;
