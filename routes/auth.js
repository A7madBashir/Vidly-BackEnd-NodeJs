const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { Users ,generateAuthToken} = require("../models/user");
const _ = require("lodash");
const Joi = require("joi");
const { application } = require("express");

router.get("/", async (req, res) => {
  const result = await Users.find().sort("username");
  //   res.status(200).send(_.pull(result, [...result]));
  res.send(result);
});

router.post("/", async (req, res) => {
  const { error } = validateAuth(req.body);
  if (error) return res.status(400).send(error.details);

  const { password, email } = req.body;

  let user = await Users.findOne({ email: email });
  if (!user) return res.status(400).send("Invalid Email or Password.");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send("Invalid Email or Password.");

const token=user.generateAuthToken();
  //   res.send(_.pick(user, ["_id", "username", "email"]));
  res.send({ username: user.username, email: user.email, token: token });
});

function validateAuth(req) {
  const schema = Joi.object({
    password: Joi.string().min(3).max(255).required(),
    email: Joi.string().min(3).max(255).required().email(),
  });

  return schema.validate(req, { abortEarly: false });
}

module.exports = router;
