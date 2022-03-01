const express = require("express");
const router = express.Router();
const { Movie } = require("../models/movie");
const { Rental, validateRental } = require("../models/rental");
const { Customer } = require("../models/customer");
const Fawn = require("fawn");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const result = await Rental.find().sort("-dateOut");
  res.status(200).send(result);
});

router.post("/",auth, async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { customerId, movieId } = req.body;

  const customer = await Customer.findById(customerId);
  if (!customer) return res.status(400).send("Invalid customer.");

  const movie = await Movie.findById(movieId);
  if (!movie) return res.status(400).send("Invalid movie.");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not In stack.");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });
  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();
  } catch (err) {
    console.log("Something went wrong", err);
    res.status(500).send("Something Failed");
  }
  res.send(result);
});

// router.put("/:id", async (req, res) => {
//   const id = req.params.id;
//   const title = req.body.title;
//   const genreId = req.body.genreId;
//   const movie = await Movie.find({ _id: id }).select({
//     name: 1,
//   });
//   if (!movie || movie.length === 0)
//     return res.status(404).send("Sorry there is not movie with the id:" + id);

//   const { error } = validateMovie({ title: title, genreId: genreId });
//   console.log(error);
//   if (error.details) {
//     return res.status(400).send(error.details.map((e) => e.message));
//   }
//   const result = await updateMovie(id, title);
//   res.send(result);
// });
// async function updateMovie(id, newTitle) {
//   const result = await Movie.findByIdAndUpdate(
//     id,
//     {
//       $set: {
//         title: newTitle,
//       },
//     },
//     { new: true }
//   );

//   console.log(result);
//   return result;
// }

// router.delete("/:id", async (req, res) => {
//   const id = req.params.id;
//   const movie = await Movie.find({ _id: id }).select({
//     name: 1,
//   });
//   //   console.log(movie);
//   if (!movie || movie.length === 0)
//     return res.status(404).send("Sorry there is no movie with the id:" + id);
//   const result = await removeMovie(id);
//   res.status(202).send(result);
// });

// async function removeMovie(id) {
//   const deleteFind = await Movie.findByIdAndRemove(id);
//   console.log(deleteFind);
//   return deleteFind;
// }

module.exports = router;
