const winston = require("winston");
require("winston-mongodb");
require("express-async-errors"); // return me express hanlder with err argument extra this argument set in the first then comes the rest of express middleware res,req,next but as i say this function will enable app.use() that has function with 4 arg and this what we defined in error file

/*
// this is how to handle uncaught exception
// just through the process object event emitter
// call in .on() standred event 'uncaught...'
// listen to server when an event throw an error without any handled this will take it and skip it and log it
// allways terminate the process cause it will be in unsecure or unclean state

// process.on("uncaughtException", (ex) => {
//   console.log("WE GOT AN UNCAUGHT EXCEPTION");
//   winston.error(ex.message, ex); // store the error in log error file
//   process.exit(1);
// });

// this event save you from promise rejecjtion that didn't handled
// so when promise or async function i don't no so when it throw an unhandled promise rejection
// this event will running
// process.on("unhandledRejection", (ex) => {
//   console.log("WE GOT AN UNHANDLED REJECTION");
//   throw ex;
//   // winston.error(ex.message, ex);
//   // process.exit(1);
// });
 */

module.exports = function () {
  winston.addColors({ foobar: "bold red cyanBG" });
  // winston provide uncaughtException take this exception and stored in another file log as you can see below and terminate the process
  // also it catch the uncaught rejection excpetion
  winston.exceptions.handle(
    new winston.transports.Console({}),
    new winston.transports.File({ filename: "uncaughtException.log" })
  );
  winston.add(
    new winston.transports.File({
      filename: "logfile.log",
    })
  );
  winston.add(
    new winston.transports.MongoDB({
      db: "mongodb://localhost/vidly", //for log the error in the mongo db document
      level: "error",
    })
  );
};
