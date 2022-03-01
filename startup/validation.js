const Joi = require("joi");

module.exports = function () {
  Joi.objrctId = require("joi-objectid")(Joi);
};
