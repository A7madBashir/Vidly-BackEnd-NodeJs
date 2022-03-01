const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Customer, validate } = require("../models/customer");

async function createCustomer(cusname, phone) {
  const customer = new Customer({
    name: cusname,
    phone: phone,
  });
  try {
    const result = await customer.save();
    console.log(result);
    return result;
  } catch (ex) {
    // console.log("Something went wrong:", ex);
    return ex.message;
  }
}

router.get("/", async (req, res) => {
  const result = await Customer.find().sort("name");
  res.status(200).send(result);
});

router.get("/:name", async (req, res) => {
  const customer = await Customer.find({ name: req.params.name }).select({
    name: 1,
  });
  console.log(genre.length);
  if (!customer)
    return res
      .status(404)
      .send("Sorry there is not Customer with the name:" + req.params.name);

  res.status(200).send(...customer);
});
router.post("/", async (req, res) => {
  const { name, phone } = req.body;
  const result = await createCustomer(name, phone);
  console.log(result);
  res.send(result);
});
router.put("/:id", auth, async (req, res) => {
  const id = req.params.id;
  const { name, phone } = req.body;
  const customer = await Customer.find({ _id: id }).select({
    name: 1,
  });
  if (!customer || customer.length === 0)
    return res
      .status(404)
      .send("Sorry there is not Customer with the given id:" + id);

  const { error } = validate(req.body);
  console.log(error);
  if (error.details) {
    // if (error.details || []) {
    return res.status(400).send(error.details.map((e) => e.message));
    // }
    // return res.status(400).send(error.message);
  }
  const result = await updateCustomer(id, name, phone);
  res.send(result);
});
async function updateCustomer(id, newName, newPhone) {
  const result = await Customer.findByIdAndUpdate(
    id,
    {
      $set: {
        name: newName,
        phone: newPhone,
      },
    },
    { new: true }
  );

  console.log(result);
  return result;
}

router.delete("/:id",auth, async (req, res) => {
  const id = req.params.id;
  const customer = await Customer.find({ _id: id }).select({
    name: 1,
  });
  console.log(customer);
  if (!customer || customer.length === 0)
    return res.status(404).send("Sorry there is no Customer with the id:" + id);
  const result = await removeCustomer(id);
  res.status(202).send(result);
});
async function removeCustomer(id) {
  const deleteFind = await Customer.findByIdAndRemove(id);
  console.log(deleteFind);
  return deleteFind;
}

module.exports = router;
