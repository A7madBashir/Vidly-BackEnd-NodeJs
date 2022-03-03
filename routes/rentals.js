const express = require("express");
const router = express.Router();
const config = require("config");
const Fawn = require("fawn");
Fawn.init(config.get("db"));

const { Movie } = require("../models/movie");
const { Rental, validateRental } = require("../models/rental");
const { Customer } = require("../models/customer");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");

router.get("/", async (req, res) => {
  const result = await Rental.find().sort("-dateOut");
  res.status(200).send(result);
});

router.post("/", [auth, validate(validateRental)], async (req, res) => {
  const { customerId, movieId } = req.body;

  const customer = await Customer.findById(customerId);
  if (!customer) return res.status(400).send("Invalid customer.");

  const movie = await Movie.findById(movieId);
  if (!movie) return res.status(400).send("Invalid movie.");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not In stack.");

  const rental = Rental.createRental(customer, movie);

  console.log(rental);
  const result = new Fawn.Task();
  try {
    result
      .save("rentals", rental)
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();
  } catch (err) {
    console.log("Something went wrong", err);
    res.status(500).send("Something Failed");
  }
  res.status(200).send(result);
});

router.post("/rentalFee", [auth, validate(validateReturn)], async (req, res) => {
  const { customerId, movieId } = req.body;

  const rental = await Rental.lookUp(customerId, movieId);
  if (!rental) return res.status(404).send("rental not found");

  if (rental.dateReturned) return res.status(400).send("Rental is processed");

  rental.updateRentalFee();

  await Movie.findByIdAndUpdate(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 },
    }
  );

  await rental.save();
  return res.send(rental);
});

function validateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return schema.validate({ customerId: req.customerId, movieId: req.movieId });
}
module.exports = router;
