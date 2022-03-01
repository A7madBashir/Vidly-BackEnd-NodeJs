const winston = require("winston");
module.exports = function (err, req, res, next) {
  console.log("Entering error section.")
  //levels of log  
  //error
  //warn
  //info
  //verbose
  //debug
  //silly
  winston.log("error", err.message, err);
  res.status(500).send("Something failed.");
};
