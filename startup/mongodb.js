const mongoose = require("mongoose");
const winston = require("winston");

module.exports = function () {
  mongoose
    .connect("mongodb://localhost/vidly")
    .then(() => winston.info("Connect to mongodb"));
  // no need to handle the catch cause if get an error it will terminate the mongo connection
  // i already have handle excpetion no need to add one here 
  // i don't need this , i handle when exception it's raise up but will terminate the process all
};
