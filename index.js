const express = require("express");
const winston = require("winston");
const app = express();
require("./startup/routes")(app);
require("./startup/mongodb")();
require("./startup/logging")();
require("./startup/config")();
require("./startup/validation")();

app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      "<h1>Welcome To vidly.com To rentring out movies \nHere I will manage all genres from CRUD and endPonint to get it all with also validation input</h1>"
    );
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  winston.info(`Connected on port:${port}`)
);
module.exports = server;
