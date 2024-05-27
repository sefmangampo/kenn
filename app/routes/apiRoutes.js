const express = require("express");
const router = express.Router();
const dbFunctions = require("../db/dbFunctions");

router.get("/", (req, res) => {
  res.json({
    message: "Hello from api",
  });
});

module.exports = router;
