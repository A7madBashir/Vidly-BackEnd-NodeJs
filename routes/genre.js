const express = require("express");
const router = express.Router();
const { Genres, validateGenre } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

async function createGenres(gname) {
  const genres = new Genres({
    name: gname,
  });
  try {
    const result = await genres.save();
    console.log(result);
    return result;
  } catch (ex) {
    // console.log("Something went wrong:", ex);
    return ex.message;
  }
}
// createGenres("Action");

router.get('/',async (req,res)=>{
  const result = await Genres.find().sort("name");  
  res.status(200).send(result);
})

router.get("/:name", async (req, res) => {
  const genre = await Genres.find({ name: req.params.name }).select({
    name: 1,
  });
  console.log(genre.length);
  if (!genre)
    return res
      .status(404)
      .send("Sorry there is not genre with the name:" + req.params.name);

  res.status(200).send(...genre);
});
router.post("/", auth, async (req, res) => {
  const name = req.body.name;
  const result = await createGenres(name);
  console.log(result);
  res.send(result);
});
router.put("/:id", auth, async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const genre = await Genres.find({ _id: id }).select({
    name: 1,
  });
  if (!genre || genre.length === 0)
    return res.status(404).send("Sorry there is not genre with the id:" + id);

  const { error } = validateGenre(name);
  console.log(error);
  if (error) {
    return res.status(400).send(error.message);
  }
  const result = await updateGenre(id, name);
  res.send(result);
});
async function updateGenre(id, newName) {
  const result = await Genres.findByIdAndUpdate(
    id,
    {
      $set: {
        name: newName,
      },
    },
    { new: true }
  );

  console.log(result);
  return result;
}

router.delete("/:id", [auth, admin], async (req, res) => {
  const id = req.params.id;
  const genre = await Genres.find({ _id: id }).select({
    name: 1,
  });
  console.log(genre);
  if (!genre || genre.length === 0)
    return res.status(404).send("Sorry there is no genre with the id:" + id);
  const result = await removeGenre(id);
  res.status(202).json({ succes: true, result: result });
});

async function removeGenre(id) {
  const deleteFind = await Genres.findByIdAndRemove(id);
  console.log(deleteFind);
  return deleteFind;
}

module.exports = router;
