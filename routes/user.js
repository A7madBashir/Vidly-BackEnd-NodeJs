const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { Users, validateUser } = require('../models/user');
const _ = require("lodash");
const auth = require("../middleware/auth");

async function createUser(username, password, email) {
  const salt = await bcrypt.genSalt(10);
  const hashpass = await bcrypt.hash(password, salt);

  const user = new Users({
    username: username,
    password: hashpass,
    email: email,
  });
  try {
    const result = await user.save();
    return result;
  } catch (ex) {
    // console.log("Something went wrong:", ex);
    return ex.message;
  }
}

router.get("/me", auth, async (req, res) => {
  const id = req.user._id;
  const result = await Users.findById(id).select('-password');  
  res.send(result);
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details);

  const { username, password, email } = req.body;
  let user = await Users.findOne({ email: email });
  // console.log(user);
  if (user) return res.status(400).send("User alerady registered.");

  const result = await createUser(username, password, email);

  console.log(result);
  const token = result.generateAuthToken();
  console.log(token);
  res
    .header("x-auth-token", token)
    .send(_.pick(result, ["_id", "username", "email"]));
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { username, password, email } = req.body;
  const user = await Users.find({ _id: id }).select({
    name: 1,
  });
  if (!user || user.length === 0)
    return res.status(404).send("Sorry there is not user with the id:" + id);

  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details);

  const result = await updateUser(id, username, password, email);
  res.send(result);
});
async function updateMovie(id, newName, newPass, newEmail) {
  const result = await Users.findByIdAndUpdate(
    id,
    {
      $set: {
        username: newName,
        password: newPass,
        email: newEmail,
      },
    },
    { new: true }
  );

  console.log(result);
  return result;
}

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const user = await Users.find({ _id: id }).select({
    name: 1,
  });
  //   console.log(movie);
  if (!user || user.length === 0)
    return res.status(404).send("Sorry there is no user with the id:" + id);
  const result = await removeUser(id);
  res.status(202).send(result);
});

async function removeUser(id) {
  const deleteFind = await Users.findByIdAndRemove(id);
  console.log(deleteFind);
  return deleteFind;
}

module.exports = router;
