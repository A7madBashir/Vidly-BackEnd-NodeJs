const _ = require("lodash");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { Users, validateUser } = require("../models/user");

router.get("/me", auth, async (req, res) => {
  const id = req.user._id;
  const result = await Users.findById(id).select("-password");
  res.send(result);
});

router.post("/", validate(validateUser), async (req, res) => {
  const { username, password, email } = req.body;
  let user = await Users.findOne({ email: email });
  // console.log(user);
  if (user) return res.status(400).send("User alerady registered.");

  const result = await Users.createUser(username, password, email);
  result.save();
  const token = result.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(result, ["_id", "username", "email"]));
});

router.put("/:id", validate(validateUser), async (req, res) => {
  const id = req.params.id;
  const { username, password, email } = req.body;
  const user = await Users.find({ _id: id }).select({
    name: 1,
  });
  if (!user || user.length === 0)
    return res.status(404).send("Sorry there is not user with the id:" + id);

  const result = await updateUser(id, username, password, email);
  res.send(result);
});
async function updateUser(id, newName, newPass, newEmail) {
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
