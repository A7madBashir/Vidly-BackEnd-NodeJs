const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = mongoose;

const genresSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25,
  },
});
const Genres = mongoose.model("Genres", genresSchema);

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate({ name: genre });
}
exports.Genres = Genres;
exports.validateGenre = validateGenre;
exports.genresSchema = genresSchema;
