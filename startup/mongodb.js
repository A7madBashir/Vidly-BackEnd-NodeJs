const mongoose = require("mongoose");
const winston = require("winston");
const config=require('config')
module.exports = function () {
  const db=config.get('db')
  mongoose
    .connect(db)//mongodb://localhost/vidly
    .then(() => winston.info(`Connect to ${db}`));
  // no need to handle the catch cause if get an error it will terminate the mongo connection
  // i already have handle excpetion no need to add one here 
  // i don't need this , i handle when exception it's raise up but will terminate the process all
};
