const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = mongoose;

const customerSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25,
  },
  isGold: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25,
  },
});
const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(25).required(),
    phone: Joi.string().min(3).max(25).required(),
    // isGold:Joi.boolean()
  });

  return schema.validate(
    { name: customer.name, phone: customer.phone },
    { abortEarly: false }
  );
}

exports.Customer=Customer;
exports.validate=validateCustomer;