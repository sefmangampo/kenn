const connection = require("../../config/dbConfig");

exports.testConnection = (callback) => {
  connection.getConnection((err, con) => {
    if (err) {
      console.error("error connecting to database".err);
      callback(err);
      return;
    } else {
      console.log("Connected to database");
      con.release();
      callback(null, true);
    }
  });
};
