const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    trim: true,
    unique: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
});
//userSchema.methods.generateAuthToken=function(){}
// same result
userSchema.method("generateAuthToken", function () {
  const token = jwt.sign({ _id: this._id ,isAdmin:this.isAdmin}, config.get("jwtPrivateKey"));
  return token;
});
const Users = mongoose.model("Users", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(3).max(255).required(),
    email: Joi.string().min(3).max(255).required().email(),
  });

  return schema.validate(user, { abortEarly: false });
}
exports.Users = Users;
exports.validateUser = validateUser;
exports.userSchema = userSchema;
