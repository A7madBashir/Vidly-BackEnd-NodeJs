const mongoose = require("mongoose");
const { Schema } = mongoose;
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");

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
    default:false    
  },
});
//userSchema.methods.generateAuthToken=function(){}
// same result
userSchema.method("generateAuthToken", function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
});

userSchema.statics.createUser = async function (username, password, email) {
  const salt = await bcrypt.genSalt(10);
  const hashpass = await bcrypt.hash(password, salt);

  return new this({
    username: username,
    password: hashpass,
    email: email,
  });
};

const Users = mongoose.model("Users", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(5).required(),
    password: Joi.string().min(8).max(255).required(),
    email: Joi.string().min(5).max(255).required().email(),
  });

  return schema.validate(user, { abortEarly: false });
}
exports.Users = Users;
exports.validateUser = validateUser;
exports.userSchema = userSchema;
