const express = require("express");
const { requireAuth } = require("../middleware");
const router = express.Router();

// Data awal (disimpan di memori, tanpa database)
let anime = [
  {
    id: 1,
    title: "Fullmetal Alchemist: Brotherhood",
    genre: "Action",
    episodes: 64,
    rating: 9.1,
    status: "completed",
  },
  {
    id: 2,
    title: "Death Note",
    genre: "Thriller",
    episodes: 37,
    rating: 8.6,
    status: "completed",
  },
  {
    id: 3,
    title: "Steins;Gate",
    genre: "Sci-Fi",
    episodes: 24,
    rating: 9.0,
    status: "completed",
  },
  {
    id: 4,
    title: "Demon Slayer",
    genre: "Action",
    episodes: 26,
    rating: 8.4,
    status: "completed",
  },
  {
    id: 5,
    title: "One Punch Man",
    genre: "Comedy",
    episodes: 12,
    rating: 8.5,
    status: "completed",
  },
];

let nextId = 6;

function findIndexOr404(id) {
  const index = anime.findIndex((a) => a.id === Number(id));
  if (index === -1) {
    const err = new Error("Anime not found");
    err.status = 404;
    throw err;
  }
  return index;
}

function validate({ title, genre, episodes, rating, status } = {}) {
  if (!title || !genre || !status) {
    return "title, genre, and status are required";
  } else if (typeof episodes !== "number" || typeof rating !== "number") {
    return "episodes and rating must be numbers";
  }
  return null;
}

// /anime
router
  .route("/")
  .get((req, res) => {
    res.json(anime);
  })
  .post((req, res) => {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });

    const { title, genre, episodes, rating, status } = req.body;
    const newAnime = { id: nextId++, title, genre, episodes, rating, status };

    anime.push(newAnime);
    res.status(201).json(newAnime);
  });

// GET /anime/genre atau /anime/genre/Action
router.get("/genre{/:name}", (req, res) => {
  const { name } = req.params;

  // Tanpa nilai: tampilkan semua
  if (!name) {
    return res.json(anime);
  }

  const result = anime.filter(
    (a) => a.genre.toLowerCase() === name.toLowerCase(),
  );
  res.json(result);
});

// /anime/:id
router
  .route("/:id")
  .get(async (req, res) => {
    res.json(anime[findIndexOr404(req.params.id)]);
  })
  .put(async (req, res) => {
    const index = findIndexOr404(req.params.id);

    const error = validate(req.body);
    if (error) return res.status(400).json({ error });

    const { title, genre, episodes, rating, status } = req.body;
    anime[index] = {
      id: anime[index].id,
      title,
      genre,
      episodes,
      rating,
      status,
    };

    res.json(anime[index]);
  })
  .delete(requireAuth, async (req, res) => {
    const index = findIndexOr404(req.params.id);
    const [removed] = anime.splice(index, 1);

    res.json({ message: "Anime deleted", data: removed });
  });

module.exports = router;
