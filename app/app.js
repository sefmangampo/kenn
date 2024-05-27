const express = require("express");
const app = express();

require("dotenv").config();

const routes = require("./routes/routes");
const apiRoutes = require("./routes/apiRoutes");
const config = require("../config/config");

app.use(express.json());
app.use(routes);
app.use("/api", apiRoutes);

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(config.port, () => {
  console.log("server is running at port:", config.port);
});
