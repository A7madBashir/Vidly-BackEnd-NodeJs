const express = require("express");
const router = express.Router();
const { Movie, validateMovie } = require("../models/movie");
const { Genres } = require("../models/genre");
const auth = require("../middleware/auth");

async function createMovie(title, genre) {
  const movie = new Movie({
    title: title,
    genre: {
      // set this specfic propreties for just not set genre object to an genre object cause it maybe have 50 prop and i want to just update 2 or 3 propreties
      _id: genre._id,
      name: genre.name,
    },
  });
  try {
    await movie.save();
    console.log(result);
    return movie;
  } catch (ex) {
    // console.log("Something went wrong:", ex);
    return ex.message;
  }
}
// createGenres("Action");

router.get("/", async (req, res) => {
  const result = await Movie.find().sort("name");
  res.status(200).send(result);
});

router.get("/:name", async (req, res) => {
  const movie = await Movie.find({ name: req.params.name }).select({
    name: 1,
  });
  //   console.log(genre.length);
  if (!movie)
    return res
      .status(404)
      .send("Sorry there is not Movie with the name:" + req.params.name);

  res.status(200).send(...movie);
});

router.post("/", auth, async (req, res) => {  
  const { title, genreId } = req.body;
  const genre = await Genres.findById(genreId);
  const result = await createMovie(title, genre);
  console.log(result);
  res.send(result);
});

router.put("/:id", auth, async (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  const genreId = req.body.genreId;
  const movie = await Movie.find({ _id: id }).select({
    name: 1,
  });
  if (!movie || movie.length === 0)
    return res.status(404).send("Sorry there is not movie with the id:" + id);

  const { error } = validateMovie({ title: title, genreId: genreId });
  console.log(error);
  if (error.details) {
    return res.status(400).send(error.details.map((e) => e.message));
  }
  const result = await updateMovie(id, title);
  res.send(result);
});
async function updateMovie(id, newTitle) {
  const result = await Movie.findByIdAndUpdate(
    id,
    {
      $set: {
        title: newTitle,
      },
    },
    { new: true }
  );

  console.log(result);
  return result;
}

router.delete("/:id", auth, async (req, res) => {
  const id = req.params.id;
  const movie = await Movie.find({ _id: id }).select({
    name: 1,
  });
  //   console.log(movie);
  if (!movie || movie.length === 0)
    return res.status(404).send("Sorry there is no movie with the id:" + id);
  const result = await removeMovie(id);
  res.status(202).send(result);
});

async function removeMovie(id) {
  const deleteFind = await Movie.findByIdAndRemove(id);
  console.log(deleteFind);
  return deleteFind;
}

module.exports = router;
