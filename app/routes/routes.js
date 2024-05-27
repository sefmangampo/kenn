const express = require("express");
const router = express.Router();
const dbFunctions = require("../db/dbFunctions");

router.get("/", (req, res) => {
  res.send("hello");
});
router.get("/test-connection", (req, res) => {
  dbFunctions.testConnection((err, connected) => {
    if (err) {
      res.status(500).json({ message: "Failed to connect to database" });
      return;
    } else {
      res.status(200).json({ message: "Database connection successfull" });
    }
  });
});

module.exports = router;
