const express = require("express");
const genres = require("../routes/genre");
const customers = require("../routes/customers");
const movie = require("../routes/movie");
const rental = require("../routes/rentals");
const users = require("../routes/user");
const auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/movies", movie);
  app.use("/api/rentals", rental);
  app.use("/api/users", users);
  app.use("/api/auth", auth);

  app.use(error); // function take 4 argument first of them the error of express
};
