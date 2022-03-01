const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { Schema } = mongoose;
const { genresSchema } = require("./genre");

const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25,
    trim: true,
  },
  genre: { type: genresSchema, required: true },
  numberInStock: { type: Number, default: 0 },
  dailyRentalRate: { type: Number, default: 0 },
});
const Movie = mongoose.model("Movie", movieSchema);

function validateMovie(movie) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    genreId: Joi.objectId.required(),
    // here i use external document to validate an object id of mongo document
    // this action seems to use mongoose.isValid()
    // and send any number i want and it's return true if there were an object id or false if there not
    // it's soooo helpful when combine document with entries of document ids
  });

  return schema.validate(
    { title: movie.title, genreId: movie.genreId },
    { abortEarly: false }
  );
}

exports.Movie = Movie;
exports.validateMovie = validateMovie;
